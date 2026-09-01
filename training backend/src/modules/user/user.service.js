const UserModel = require("../../models/auth.model");
const apiError = require("../../utils/apiError");
const { uploadToCloudinary } = require("../../utils/uploadToCloudinary");
const cloudinary = require("../../config/Cloudinary");

const getOwnProfileService = async (userID) => {
  const user = await UserModel.findById(userID);

  if (!user) {
    throw apiError(404, "User not found!");
  }

  return user;
};

const updateProfileService = async (id, data, image) => {
  let updateData = { ...data };

  if (image) {
    const uploadedImage = await uploadToCloudinary(
      image.buffer,
      "profilePictures",
    );

    updateData.profilePhoto = uploadedImage;
  }

  const result = await UserModel.findOneAndUpdate(
    { _id: id },
    { $set: updateData },
    { returnDocument: "after" },
  );

  return result;
};

const getAllAddressesService = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw apiError(404, "user not found");
  }
  const addresses = user.addressess || [];
  if (addresses.length <= 0) {
    throw apiError(404, "you don't have any address please create one !");
  }
  return addresses;
};

const createAddressesService = async (id, data) => {
  const user = await getOwnProfileService(id);
  if (!user.addressess) {
    user.addressess = [];
  }
  if (user.addressess.length >= 5) {
    throw apiError(429, "max addresses limit reached, can't create more");
  }

  const newAddress = user.addressess.create(data);

  if (user.addressess.length === 0 || newAddress.isDefault) {
    user.addressess.forEach((address) => {
      address.isDefault = false;
    });

    newAddress.isDefault = true;
  }

  user.addressess.push(newAddress);
  await user.save();
  return user;
};

const deleteAddressService = async (userID, addressID) => {
  const user = await getOwnProfileService(userID);
  const address = user.addressess?.id(addressID);

  if (!address) throw apiError(404, "address not found");

  const wasDefault = address.isDefault;
  address.deleteOne();

  if (user.addressess.length > 0 && wasDefault === true) {
    user.addressess[0].isDefault = true;
  }
  await user.save();
};

const updateAddressService = async (userID, addressID, patch) => {
  const user = await getOwnProfileService(userID);

  const address = user.addressess?.id(addressID);

  if (!address) {
    throw apiError(404, "Address not found");
  }

  Object.assign(address, patch);

  if (patch.isDefault === true) {
    user.addressess.forEach((addr) => {
      if (addr._id.toString() !== addressID) {
        addr.isDefault = false;
      }
    });
  }

  await user.save();

  return address;
};

module.exports = {
  getOwnProfileService,
  updateProfileService,
  getAllAddressesService,
  createAddressesService,
  deleteAddressService,
  updateAddressService,
};
