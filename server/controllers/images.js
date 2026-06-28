import { uploadImage } from "../utility/images.js";

export const uploadImages = async (req, res) => {
    try {
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded."
            });
        }

        const result = await uploadImage(files);

        return res.status(200).json(result);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            error: "Error uploading images."
        });
    }
};