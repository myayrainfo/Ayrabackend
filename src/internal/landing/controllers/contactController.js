import Contact from "../models/Contact.js";

const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    await Contact.create({ name, email, message });

    return res.status(201).json({
      success: true,
      message: "Message received successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save contact request.",
      error: error.message,
    });
  }
};

export { submitContactForm };




