import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from 'storybook/test';
import { Textarea } from './textarea';
import { AutosizeTextarea } from '../autosize-textarea';
import { Label } from '../label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import * as React from 'react';
import { useState } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../form';
import { toast } from 'sonner';
import { Button } from '../button';

const meta: Meta<typeof Textarea> = {
    title: 'Primitives/Textarea',
    component: Textarea,
    tags: ['autodocs'],
    argTypes: {
        disabled: {
            control: 'boolean',
        },
        placeholder: {
            control: 'text',
        },
    },
    args: {
        placeholder: 'Type your message here.',
    },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const textarea = canvas.getByRole('textbox');
        await expect(textarea).toBeInTheDocument();
        await userEvent.type(textarea, 'Hello World', { delay: 50 });
        await expect(textarea).toHaveValue('Hello World');
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const WithLabel: Story = {
    render: (args) => (
        <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Your Message</Label>
            <Textarea id="message" {...args} />
            <p className="text-sm text-muted-foreground">
                Your message will be specifically formatted.
            </p>
        </div>
    ),
};

export const Autosize: Story = {
    render: (args) => (
        <div className="w-full">
            <AutosizeTextarea
                placeholder="This textarea automatically resizes based on content. Try typing multiple lines!"
            />
        </div>
    ),
};

const FormSchema = z.object({
    bio: z.string().min(10, {
        message: 'Bio must be at least 10 characters.',
    }),
});

const DEFAULT_VALUE = {
    bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
};

export const AutosizeWithForm: Story = {
    render: () => {
        const AutosizeTextareaForm = () => {
            const form = useForm<z.infer<typeof FormSchema>>({
                defaultValues: DEFAULT_VALUE,
                resolver: zodResolver(FormSchema),
            });

            const [isClearBio, setIsClearBio] = useState(false);
            const [loading, setLoading] = useState(false);

            function onSubmit(data: z.infer<typeof FormSchema>) {
                setLoading(true);

                setTimeout(() => {
                    setLoading(false);
                    toast({
                        title: 'Your submitted data',
                        description: (
                            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                                <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                            </pre>
                        ),
                    });
                    if (isClearBio) {
                        form.setValue('bio', '');
                    }
                }, 500);
            }

            return (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                        <span className="flex gap-2 items-center">
                            <input
                                type="checkbox"
                                id="should-clear-bio"
                                className="cursor-pointer"
                                checked={isClearBio}
                                onChange={() => setIsClearBio((pre) => !pre)}
                            />
                            <label htmlFor="should-clear-bio" className="cursor-pointer text-sm">
                                Clear bio after submit.
                            </label>
                        </span>

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="bio">Bio</FormLabel>
                                    <FormControl>
                                        <AutosizeTextarea id="bio" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button loading={loading} type="submit">
                            Submit
                        </Button>
                    </form>
                </Form>
            );
        };

        return <AutosizeTextareaForm />;
    },
};
