const asyncHandler = require("../../utils/asyncHandler");
const userService = require("./user.service ");
const apiResponse = require("../../utils/apiResponse");

//=============user controller=============
// get own profile
const getOwnProfileController = asyncHandler(async (req, res) => {
  const user = await userService.getOwnProfileService(req.user.sub);

  res.status(200).json(apiResponse(200, user, "User fetched successfully!"));
});

//update own profile
const updateOwnProfileController = asyncHandler(async (req, res) => {
  const data = req.body;

  const image = req.file;
  const id = req.user.sub;

  let allowed = ["name", "phone", "profilePhoto"];

   if(req.user.role === "seller"){
    allowed.push("shopName");
  };
const invalidFields = Object.keys(data).filter(
  (key) => !allowed.includes(key)
);

if (invalidFields.length > 0) {
  return res.status(401).json(
    apiResponse(401, null, "you are unauthorized to update other fields")
  );
}
 

  const reesult = await userService.updateProfileService(id , data, image);

  res
    .status(200)
    .json(apiResponse(200, reesult, "profile updated successfully"));
});

//get all address
const getAllAddressesController = asyncHandler(async (req, res) => {
    const adresses = await userService.getAllAddressesService(req.user.sub);
  res.status(200).json(apiResponse(200, adresses,"fetch all adresses!"));
});

//create addresses
const createAddressesController = asyncHandler(async (req, res) => {
    const data = req.body;
    const user = await userService.createAddressesService(req.user.sub,data);
  res.status(201).json(apiResponse(201,"address created!"));
});

//update address
const updateAddressesController = asyncHandler(async (req, res) => {
  const userID = req.user.sub;
  const addressID = req.params.addrId;

  const updatedAddress = await userService.updateAddressService(
    userID,
    addressID,
    req.body
  );

  res
    .status(200)
    .json(apiResponse(200, updatedAddress, "Address updated successfully!!!"));
});

const deleteAddressesController = asyncHandler(async (req, res) => {
  const userID = req.user.sub;
  const addressID = req.params.addrId;
  const patch = req.body;
  await userService.deleteAddressService(userID, addressID, patch);
  res.status(200).json(apiResponse(200,"address deleted successfully!!!"));
});

//===============admin controller==================

const updateUserStatusController = asyncHandler(async (req, res) => {
  res.status().json(apiResponse());
});

const deleteUserController = asyncHandler(async (req, res) => {
  res.status().json(apiResponse());
});

const getAllUserController = asyncHandler(async (req, res) => {
  res.status().json(apiResponse());
});

module.exports = {
  getOwnProfileController,
 
  updateOwnProfileController,
  getAllAddressesController,
  createAddressesController,
  updateAddressesController,
  deleteAddressesController,
  updateUserStatusController,
  deleteUserController,
  getAllUserController,
};
