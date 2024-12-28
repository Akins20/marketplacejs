const FAQ = () => {
  return (
    <section className="bg-white py-8 px-4 text-gray-800">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Frequently Asked Questions (FAQs)
        </h1>
        <ul className="list-disc list-inside text-gray-700">
          <li>
            <strong>What Payment Options are Available on Doodies?</strong>
            <p className="ml-4">
              You can conveniently pay online or on delivery with your cards
              (MasterCard, Visa, and Verve), bank transfers, and USSD.
            </p>
          </li>
          <li>
            <strong>Can I Return the Items I Bought?</strong>
            <p className="ml-4">
              Yes, you can return eligible items within 5 days of delivery.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
