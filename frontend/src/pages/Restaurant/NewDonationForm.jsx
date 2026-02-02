import { useForm } from "react-hook-form";
import { useContext, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import TimePicker from "../../components/ui/timepicker";
import { CiCalendar } from "react-icons/ci";
import { Calendar } from "../../components/ui/calendar";
import { useToast } from "../../hooks/use-toast";
import { useDonations } from "../../hooks/useDonations";
import { AuthContext } from "../../context/AuthContext";
import { format } from "date-fns";
import {
  convertTo24HourFormat,
  convertTo12HourFormat,
} from "../../utils/dateTimeUtils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { ACCESS_TOKEN } from "../../constants";

// Helper function for date/time validation
const isInPast = (date, time12h) => {
  if (!date || !time12h) return false;

  const now = new Date();
  const expirationDate = new Date(date);

  // Set the time component
  const time24h = convertTo24HourFormat(time12h);
  const [hours, minutes] = time24h.split(":");
  expirationDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

  return expirationDate < now;
};

const formSchema = z
  .object({
    title: z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
      })
      .min(10, { message: "Title must be at least 10 characters" })
      .regex(/^[A-Za-z\s]+$/, {
        message: "Title must not contain numbers",
      }),
    quantity: z.string().min(1, {
      message: "Quantity is required",
    }),
    description: z.string().optional(),
    expirationDate: z.date({
      required_error: "Expiration date is required",
      message: "Expiration date is required",
    }),
    expirationTime: z
      .string()
      .min(1, { message: "Expiration time is required" }),
    measurementUnit: z.string({
      required_error: "Please select a measurement unit.",
    }),
  })
  .superRefine((data, ctx) => {
    if (isInPast(data.expirationDate, data.expirationTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Expiration date and time must be in the future",
        path: ["expirationTime"],
      });
    }
  });

export default function NewDonationForm({ onSuccess, editData }) {
  // const { token } = useContext(AuthContext);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();

  const { createDonation, deleteDonation, updateDonation, loading } =
    useDonations();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: editData?.food_item || "",
      quantity: editData?.quantity?.toString() || "",
      description: editData?.description || "",
      measurementUnit: editData?.units || "liters",
      expirationDate: editData?.expiration_date
        ? new Date(editData.expiration_date)
        : null,
      expirationTime: editData?.expiration_time
        ? convertTo12HourFormat(editData.expiration_time)
        : "",
    },
    mode: "all",
  });

  const selectedDate = form.watch("expirationDate");
  const selectedTime = form.watch("expirationTime");

  useEffect(() => {
    if (selectedDate && selectedTime) {
      form.trigger("expirationTime");
    }
  }, [selectedDate, selectedTime, form]);

  const onSubmit = async (data) => {
    if (isInPast(data.expirationDate, data.expirationTime)) {
      form.setError("expirationTime", {
        type: "manual",
        message: "Expiration date and time must be in the future",
      });
      return;
    }

    const formattedData = {
      food_item: data.title,
      quantity: Number(data.quantity),
      description: data.description || "",
      expiration_date: format(data.expirationDate, "yyyy-MM-dd"),
      expiration_time: convertTo24HourFormat(data.expirationTime),
      units: data.measurementUnit,
    };

    try {
      if (editData) {
        await updateDonation(editData.id, formattedData);
        toast({
          title: "Donation updated!",
          description: "Your donation has been successfully updated.",
        });
      } else {
        await createDonation(formattedData);
        toast({
          title: "Donation added",
          description: "Your donation has been successfully added.",
        });
      }
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error with donation :", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: editData
          ? "Failed to update donation. Try again"
          : "Failed to add donation. Try again.",
      });
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this donation?",
    );
    if (!confirmed) return;
    try {
      await deleteDonation(editData.id);

      toast({
        title: "Donation deleted",
        description: "The donation has been removed.",
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message || "Try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Food Item</FormLabel>
              <FormControl>
                <Input placeholder="E.g, Cooked Rice & Curry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input placeholder="5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="measurementUnit"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="liters">Liters</SelectItem>
                    <SelectItem value="kilograms">Kilograms</SelectItem>
                    <SelectItem value="servings">Servings</SelectItem>
                    <SelectItem value="pieces">Pieces</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional details about the food item"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 flex-col sm:flex-row">
          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Expiration Date</FormLabel>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CiCalendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setTimeout(() => form.trigger("expirationTime"), 0);
                        setCalendarOpen(false);
                      }}
                      disabled={(date) => {
                        return (
                          date.setHours(0, 0, 0, 0) <
                          new Date().setHours(0, 0, 0, 0)
                        );
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select when this food item will expire.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expirationTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Expiration Time</FormLabel>
                <TimePicker
                  value={field.value || ""}
                  onChange={(time) => {
                    field.onChange(time || "");
                    if (time && form.getValues("expirationDate")) {
                      setTimeout(() => form.trigger("expirationTime"), 0);
                    }
                  }}
                  selectedDate={form.watch("expirationDate")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between flex-wrap gap-2">
          {editData && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess?.()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? editData
                  ? "Updating..."
                  : "Adding..."
                : editData
                  ? "Update"
                  : "Add Donation"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
