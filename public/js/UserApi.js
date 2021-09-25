class UserApi {
    static async getAll() {
        const resp = await axios.get("/users/");
        return resp.data;
    }

    static async update(updatedUser) {
        const id = updatedUser.id;
        const resp = await axios.put(`/users/${id}`, updatedUser);
        return resp.data
        
    }

    static async signup({email, firstName, lastName}) {
        const resp = await axios.post("/users/", {email, firstName, lastName});
        return resp.data;
    }
}