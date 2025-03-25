import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import TimePicker from "../../components/ui/timepicker";
import { CiCalendar } from "react-icons/ci";
import { Calendar } from "../../components/ui/calendar";

import { useToast } from "../../hooks/use-toast"; // Ensure correct import

import { format } from "date-fns";
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

const formSchema = z.object({
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

  expirationTime: z.string().min(1, { message: "Expiration time is required" }),

  measurementUnit: z.string({
    required_error: "Please select a measurement unit.",
  }),
});

export default function NewDonationForm({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      quantity: "",
      description: "",
      measurementUnit: "liters",
      expirationDate: null,
      expirationTime: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);

    setTimeout(() => {
      toast({
        title: "Donation added!",
        description: "Your donation has been successfully added.",
      });
    }, 2000);
    form.reset();
    onSuccess();
  };

  return (
    <>
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
          <div className="flex gap-2 items-baseline">
            {" "}
            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Expiration Date & Time</FormLabel>

                  <Popover open={open} onOpenChange={setOpen}>
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
                          setOpen(false);
                        }}
                        disabled={(date) =>
                          date < new Date() ||
                          date >
                            new Date(
                              new Date().setMonth(new Date().getMonth() + 6)
                            )
                        }
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
                    }}
                  />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onSuccess}>
              Cancel
            </Button>
            <Button type="submit">Add Donation</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
