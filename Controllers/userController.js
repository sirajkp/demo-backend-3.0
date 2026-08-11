export const getUsers = (req, res) => {
  res.json({
    success: true,
    message: "Users fetched successfully",
  });
};


export const getUsersById = (req, res) => {
  res.json({
    success: true,
    message: "User fetched successfully",
    data: {
        id: req.params.id,
        name: "Abhijith"
    }
  });
};