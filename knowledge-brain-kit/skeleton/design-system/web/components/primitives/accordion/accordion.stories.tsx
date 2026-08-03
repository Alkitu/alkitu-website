import type { Meta, StoryObj } from "@storybook/react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../card"

const meta: Meta<typeof Accordion> = {
    title: "Primitives/Accordion",
    component: Accordion,
    tags: ["autodocs"],
    argTypes: {
        type: {
            control: "radio",
            options: ["single", "multiple"],
        },
        collapsible: {
            control: "boolean",
        },
    },
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
    render: (args) => (
        <div className="w-[400px]">
            <Accordion {...args} className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Is it styled?</AccordionTrigger>
                    <AccordionContent>
                        Yes. It comes with default styles that matches the other
                        components' aesthetic.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Is it animated?</AccordionTrigger>
                    <AccordionContent>
                        Yes. It's animated by default, but you can disable it if you
                        prefer.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    ),
}

export const InCard: Story = {
    render: (args) => (
        <Card className="w-[500px]">
            <CardHeader>
                <CardTitle>Subscription & Billing</CardTitle>
                <CardDescription>Common questions about your account, plans, and payments</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion {...args} className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What subscription plans do you offer?</AccordionTrigger>
                        <AccordionContent>
                            We offer Basic, Pro, and Enterprise plans tailored to your needs.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How does billing work?</AccordionTrigger>
                        <AccordionContent>
                            You are billed monthly automatically on your credit card.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Can I upgrade or downgrade my plan?</AccordionTrigger>
                        <AccordionContent>
                            Yes, you can change your plan at any time. When upgrading, you'll be
                            charged a prorated amount for the remainder of your billing cycle and
                            immediately gain access to new features.
                            <br /><br />
                            When downgrading, the change takes effect at the end of your current
                            billing period, and you'll retain access to premium features until then. No
                            refunds are provided for downgrades.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>How do I cancel my subscription?</AccordionTrigger>
                        <AccordionContent>
                            You can cancel anytime from your account settings.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>What is your refund policy?</AccordionTrigger>
                        <AccordionContent>
                            We offer a 14-day money-back guarantee for new subscriptions.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    ),
}

export const WithDisabled: Story = {
    render: (args) => (
        <div className="w-[500px]">
            <Accordion {...args} className="w-full rounded-lg border bg-card p-4">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Can I access my account history?</AccordionTrigger>
                    <AccordionContent>
                        Yes, you can view your complete account history including all
                        transactions, plan changes, and support tickets in the Account History
                        section of your dashboard.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" disabled>
                    <AccordionTrigger>Premium feature information</AccordionTrigger>
                    <AccordionContent>
                        You need to upgrade to access this information.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>How do I update my email address?</AccordionTrigger>
                    <AccordionContent>
                        You can update your email address in your profile settings.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
