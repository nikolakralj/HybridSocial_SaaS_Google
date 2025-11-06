import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export function PricingFAQ() {
  const faqs = [
    {
      question: "Is my profile public?",
      answer: "Your Personal Profile visibility is your choice. You can keep it private, share with your network, or make it fully public. Worker Records (created by companies/agencies) are always private to that organization.",
    },
    {
      question: "Can I hire contractors compliantly?",
      answer: "Yes. WorkGraph supports direct contracts, EoR partnerships, and vendor arrangements. Built-in approval chains, audit trails, and multi-party invoicing ensure compliance with your internal processes.",
    },
    {
      question: "How do payouts work?",
      answer: "Freelancers auto-generate invoices from approved timesheets. Companies approve and pay via their preferred method (ACH, wire, Stripe). Agencies can handle 3-way splits (agency fee, worker pay, client billing) in one flow.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-center mb-8 text-xl font-semibold">Common questions</h3>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
