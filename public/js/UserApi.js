class UserApi {
    static async getAll() {
        const users = await axios.get("/users/");
        return users;
    }
    static async signup({email, firstName, lastName}) {
        const user = await axios.post("/users/", {email, firstName, lastName});
        return user.data;
    }
}