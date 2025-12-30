import { BigQuote } from "@/app/components/organisms/quote-section";

function Passion({ text }) {
  const passionData = text.home.bigQuoteSection;
  return (
    <div>
      <BigQuote text={passionData} />
    </div>
  );
}

export default Passion;
