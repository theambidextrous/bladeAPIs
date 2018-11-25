const userSchema = new Schema({
    firstName: String,
    lastName: String,
    Email: String,
    permissionLevel: Number
});

const userModel = mongooose.model("Users", userSchema);