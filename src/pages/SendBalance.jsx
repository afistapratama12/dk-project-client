import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { axiosGet } from "../API/axios.js"
import { NavigationBar } from "../components/Navbar.jsx"


function SendBalance() {
    const auth = localStorage.getItem("access_token")

    const [allUser, setAllUser] = useState()

    const getAllUser = async () => {
        try {
            const { data } = await axiosGet(auth, `/v1/users`)

            setAllUser(data)

        } catch (err) {
            console.log(err.response)
        }
    }

    useEffect(() => {
        getAllUser()
    },[])


    return (
        <>
        <NavigationBar/>    

        <Text>Pilih Saldo :</Text>

        <Flex>
            <Button>Saldo Keuangan</Button>
            <Button ml={2}>Saldo Repeat Order</Button>
            <Button ml={2}>Saldo SAS</Button>
        </Flex>

        <Text>Pilih User :</Text>

        { allUser?.map((user, id) => (
            <Box key={id}>
                <Flex p={2}>
                    <Text>{user.fullname}</Text>
                    <Text>{user.phone_number}</Text>
                    <Button>Pilih</Button>
                </Flex>
            </Box>
        ))}



        </>
    )
}

export { SendBalance }