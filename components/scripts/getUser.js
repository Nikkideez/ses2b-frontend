import axios from 'axios';

export async function getUser(token) {
    const user = await axios({
        method: "POST",
        url: "https://protoruts-backend.herokuapp.com/auth/current-user",
        data: {
            idToken: token
        },
        withCredentials: true,
    }).then((res) => {
        return res.data;
    })

    const returnUser = async () => {
        const userDetail = await user;
        return userDetail;
    }

    return returnUser();
}