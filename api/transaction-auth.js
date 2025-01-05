const PAYSTACK_API_BASE = "https://api.paystack.co";
const PAYSTACK_SECRET_LIVE_KEY =
  process.env.PAYSTACK_SECRET_KEY ||
  "your paystack live secret key"; // Use your live key
const PAYSATCK_SECRET_TEST_KEY =
  process.env.PAYSTACK_TEST_SECRET_KEY ||
  "your paystack test secret key";

// Fetch list of banks from Paystack API
async function getBanks() {
  const response = await fetch(`${PAYSTACK_API_BASE}/bank`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSATCK_SECRET_TEST_KEY}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch banks");
  }

  const data = await response.json();
  return data.data;
}

// Create a subaccount in Paystack
async function createSubaccount(data) {
  const {
    businessName,
    bankCode,
    accountNumber,
    fullName,
    email,
    phoneNumber,
  } = data;

  const response = await fetch(`${PAYSTACK_API_BASE}/subaccount`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSATCK_SECRET_TEST_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      business_name: businessName,
      settlement_bank: bankCode,
      account_number: accountNumber,
      primary_contact_name: fullName,
      primary_contact_email: email,
      primary_contact_phone: phoneNumber,
      percentage_charge: 97.5, // 97.5% charge
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create subaccount");
  }

  const subaccountData = await response.json();
  return subaccountData.data;
}

// Create a transaction split using the subaccount
async function createTransactionSplit(subaccountId, subAccountName) {
  const response = await fetch(`${PAYSTACK_API_BASE}/split`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSATCK_SECRET_TEST_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: subAccountName + "_split",
      subaccount: subaccountId, // Use the subaccount ID created
      currency: "NGN",
      type: "percentage", // Type of split
      subaccounts: [
        {
          subaccount: subaccountId,
          share: 97.5,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create transaction split");
  }

  const transactionSplitData = await response.json();
  return transactionSplitData.data;
}

// Handle errors
function handleError(error, res) {
  console.error(error);
  return res.status(500).json({
    message: error.message || "An error occurred",
  });
}

export default async function handler(req, res) {
  try {
    // Handle the request based on the HTTP method
    switch (req.method) {
      case "GET": {
        // Fetch and return list of banks
        const banks = await getBanks();
        return res.status(200).json({ banks });
      }

      case "POST": {
        const {
          businessName,
          bankCode,
          accountNumber,
          email,
          fullName,
          phoneNumber,
        } = req.body;

        if (!businessName || !bankCode || !accountNumber) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        // console.log(
        //   "Received data:",
        //   businessName,
        //   bankCode,
        //   accountNumber,
        //   email,
        //   fullName,
        //   phoneNumber
        // );

        // Create subaccount
        const subaccountData = await createSubaccount({
          businessName,
          bankCode,
          accountNumber,
          fullName,
          email,
          phoneNumber,
        });

        // console.log("Subaccount created:", JSON.stringify(subaccountData));

        // Create transaction split using the subaccount
        const transactionSplitData = await createTransactionSplit(
          subaccountData.id,
          subaccountData.business_name
        );

        // console.log(
        //   "Transaction split created:",
        //   JSON.stringify(transactionSplitData)
        // );

        // Respond with both subaccount and transaction split data
        return res.status(201).json({
          message: "Subaccount and transaction split created successfully",
          transactionSplit: transactionSplitData,
        });
      }

      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    handleError(error, res);
  }
}
