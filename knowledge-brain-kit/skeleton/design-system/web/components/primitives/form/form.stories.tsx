import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./form";
import { Input } from "~/components/primitives/input";
import { Button } from "~/components/primitives/button";

const meta: Meta = {
  title: "Primitives/Form",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Form components built on react-hook-form. Provides FormField, FormItem, FormLabel, FormControl, FormDescription, and FormMessage.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function BasicFormExample() {
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="space-y-4 w-full max-w-sm"
      >
        <FormField
          control={form.control}
          name="username"
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const Default: Story = {
  render: () => <BasicFormExample />,
};

function FormWithErrorExample() {
  const form = useForm({
    defaultValues: {
      username: "",
    },
  });

  // Trigger validation on mount
  form.formState.isSubmitted;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="space-y-4 w-full max-w-sm"
      >
        <FormField
          control={form.control}
          name="username"
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit to see validation</Button>
      </form>
    </Form>
  );
}

export const WithValidation: Story = {
  render: () => <FormWithErrorExample />,
};
