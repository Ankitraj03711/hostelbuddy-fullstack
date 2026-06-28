import { Button, Card, Checkbox, Input, Option, Select, Textarea } from '@material-tailwind/react'
import { MdAdd } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { getDataFromApi, postDataFromApi } from '../utility/api'
import Toast from '../components/Toasts/Toast';
// import { handleImageCompression } from '../utility/routineFunctions'



const ProductForm = () => {


	const [formData, setFormData] = useState({
		category: "",
		description: "",
		images: "",
		title: "",
	});


	const [categories, setCategories] = useState([]);
	const [otherCategory, setOtherCategory] = useState(false);

	const [newCategory, setNewCategory] = useState({
		title: '',
		isReturnable: false
	})



	const [image, setImage] = useState(null);
	const [imagePreviewUrl, setImagePreviewUrl] = useState("");


	const [formSubmitLoading, setFormSubmitLoading] = useState(false);


	const [open, setOpen] = useState(false);
	const [toastType, setToastType] = useState("");
	const [toastMessage, setToastMessage] = useState({
		title: "",
		description: ""
	})
	const handleOpen = () => setOpen((cur) => !cur);

	useEffect(() => {
		getDataFromApi('/categories/all')
			.then((data) => {
				setCategories(data.categories)
			})
			.catch((err) => {
				console.log(err);
			})
	}, [])

	const setErrorToast = (desc) => {
		setToastMessage({ title: "Error", description: desc })
		setToastType("error")
		handleOpen();
	}

	const setSuccessToast = () => {
		setToastMessage({ title: "Added Successfully", description: "" })
		setToastType("success")
		handleOpen();
	}



	const handleFormChange = (event) => {
		const name = event.target.name;

		setFormData({ ...formData, [name]: event.target.value });
	}



	const handleImageChange = (event) => {
		if (event.target.files[0]) {
			const selectedFile = event.target.files[0];
			const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
			if (allowedTypes.includes(selectedFile.type)) {
				setImage(selectedFile);
				const reader = new FileReader();
				reader.onloadend = () => {
					setImagePreviewUrl(reader.result);
				};
				reader.readAsDataURL(selectedFile);
			} else {
				console.log('Please select a valid image file (JPEG, PNG, or GIF)');
			}
		}
	};

	const handleUpload = async () => {
		if (!image) {
			console.log("Empty image file");
			return;
		}


		try {
			const formData = new FormData();
			formData.append('image', image);

			postDataFromApi('/images/upload', formData)
				.then(data => {
					setFormData(prev => ({
						...prev,
						images: data.url
					}))
				})
		} catch (error) {
			console.error("Error uploading image", error);
		}
	};


	const clearAllField = () => {
		setFormData({
			category: "",
			description: "",
			images: "",
			title: "",
		})
		setImagePreviewUrl("")
	}

const handleSubmit = async () => {
  try {
    if (!formData.title || !formData.description || !formData.category) {
      setErrorToast("Please fill all required fields");
      return;
    }

    if (!image) {
      setErrorToast("Please select an image");
      return;
    }

    setFormSubmitLoading(true);

    if (otherCategory) {
      if (newCategory.title === "") {
        setFormSubmitLoading(false);
        setErrorToast("Please enter category name");
        return;
      }

      const dt = await postDataFromApi("/categories/add", newCategory);

      if (dt.success) {
        formData.category = dt.newCategory._id;
      }
    }

    const fd = new FormData();
    fd.append("image", image);

    console.log("Uploading Image...");
    const imageRes = await postDataFromApi("/images/upload", fd);
    console.log("Image Upload Response:", imageRes);

    formData.images = imageRes.url;

    console.log("Sending Product:", formData);

    const productRes = await postDataFromApi("/products/add", {
      productData: formData,
    });

    console.log("Product Response:", productRes);

    setFormSubmitLoading(false);
    setSuccessToast();
    clearAllField();

  } catch (err) {
    console.error("Product Error:", err);
    console.error("Server Response:", err.response?.data);

    setFormSubmitLoading(false);

    setErrorToast(
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Something went wrong"
    );
  }
};
	return (
		<div className='px-72 py-5 bg-bgGray1'>
			<Toast type={toastType} message={toastMessage} open={open} handleOpen={handleOpen} />
			<Card className='w-full h-auto p-10'>
				<h1 className='font-bold'>Add New Product</h1>
				<div className='w-full'>
					<div className='gap-5'>
						<div className='w-fit mb-5'>
							<Select
								label="Select category"
								name="category"
								onChange={(e) => setFormData({
									...formData,
									category: e
								})}
								disabled={otherCategory}
							>
								{categories.map((cat) => (
									<Option value={cat._id}>{cat.title}</Option>
								))}
							</Select>
						</div>
						<div>
							<Checkbox
								label="Other"
								name='otherCategory'
								onChange={(e) => setOtherCategory(e.target.checked)}
							/>
						</div>
						<div className='mt-3'>
							{otherCategory && (
								<Input
									label='Other category'
									value={newCategory.title}
									onChange={(e) => setNewCategory({
										...newCategory,
										title: e.target.value
									})}
								/>
							)}
						</div>
						{otherCategory && (<div>
							<Checkbox
								label="Is Returnable ?"
								name='isReturnable'
								checked={newCategory.isReturnable}
								onChange={(e) => setNewCategory({
									...newCategory,
									isReturnable: e.target.checked
								})}
							/>
						</div>)}
					</div>
					<div className='mt-7 gap-5'>
						<div>
							<label className='text-[15px] text-blue-gray-900 block'>Name of product</label>
							<input
								className='w-72 border-[1px] rounded-lg px-5 py-2 border-[#e9ebed]'
								placeholder='Enter the name of product'
								name='title'
								value={formData.title}
								onChange={handleFormChange}
							/>
						</div>
						<div className='flex-1 mt-5'>
							<label className='text-[15px] text-blue-gray-900 block'>Product description</label>
							<textarea
								className='w-full border-[1px] rounded-lg px-5 py-2 border-[#e9ebed]'
								placeholder='Description of product'
								name='description'
								value={formData.description}
								onChange={handleFormChange}
							/>
						</div>
					</div>
				</div>

				<div className='w-full mt-5'>
					<label className='text-[15px] text-blue-gray-900 block'>Add image</label>

					<div className="flex justify-start gap-5 items-center">
						<label class={`bg-[#f6f8f9] overflow-hidden text-blue relative rounded-lg flex items-center justify-center border-dashed border-[#a3adbb] tracking-wide text-center uppercase border border-blue w-44 h-44 cursor-pointer hover:bg-blue my-5`} >
							{imagePreviewUrl == "" && (
								<div className='flex flex-col items-center capitalize justify-center'>
									<MdAdd size={20} />
									Add image
								</div>
							)}
							<input
								type="file"
								accept="image/*"
								name='image.0'
								className="hidden"
								onChange={handleImageChange}
							/>
							{imagePreviewUrl != "" && (
								<img
									src={imagePreviewUrl}
									alt='image'
									className='object-cover object-center'
								/>
							)}
						</label>
					</div>
				</div>

				<div className='flex justify-end gap-5 items-center'>
					<Button variant='outlined' color='green' className='capitalize w-28 text-sm py-2'>Cancel</Button>
					<Button onClick={handleSubmit} loading={formSubmitLoading} color='green' className='capitalize w-28 text-sm py-2'>Save</Button>
				</div>
			</Card>
		</div>
	)
}

export default ProductForm