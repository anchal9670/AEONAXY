class User {
    constructor(userId, name, email, password, gender, profilePic, phone, dateOfBirth, dateOfJoining) {
      this.userId = userId;
      this.name = name;
      this.email = email;
      this.password = password;
      this.gender = gender;
      this.profilePic = profilePic;
      this.phone = phone;
      this.dateOfBirth = dateOfBirth;
      this.dateOfJoining = dateOfJoining;
    }
  }
  
  module.exports = User;
  