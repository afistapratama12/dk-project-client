import { useEffect, useState } from "react";
import { axiosGet } from "../API/axios";
import { useHistory } from "react-router-dom";

import { Box, Text, Flex } from "@chakra-ui/layout"

import { NavigationBar } from "../components/Navbar.jsx"
import { HomeDownline } from "../components/HomeDownline";
import { Loading } from "../components/Loading";
import { Button } from "@chakra-ui/react";
import { buttonResponsive, textResponsive } from "../theme/font";


function Home() {
    const auth = localStorage.getItem("access_token")

    const history = useHistory()

    const baseId = localStorage.getItem("base_id")
    const userId = localStorage.getItem("id")
    
    // id: 1
    // id_generate: ""
    // fullname: "admin"
    // money_balance: 0
    // parent_id: 0
    // phone_number: "082132132132"
    // psoition: ""
    // ro_balance: 0
    // role: "admin"
    // sas_balance: 0
    // username: "DK-1-admin"
    const [userDetail, setUserDetail] = useState();

    const userShow = {
        id : localStorage.getItem("show_id"),
        fullname : localStorage.getItem("show_fullname"),
        position : localStorage.getItem("show_position")
    }
    
    // downline lv1 data
    const [dlLeft, setDlLeft] = useState(null)
    const [dlCenter, setDlCenter] = useState(null)
    const [dlRight, setDlRight] = useState(null)

    // show more button flag
    const [showLeft, setShowLeft] = useState(false)
    const [showCenter, setShowCenter] = useState(false)
    const [showRight, setShowRight] = useState(false)

    const [isLoading, setIsLoading] = useState(false);

    const toWd = (e) => {
        e.preventDefault()

        history.push("/withdraw")
    }

    useEffect(() => {
        getUserDetailAndDownline()
    },[auth, baseId, userId])

    const getUserDetailAndDownline = async () => {
        setIsLoading(true)

        try {
            const resp1 = await axiosGet(auth, `/v1/users/self`)
            setUserDetail(resp1.data)

            const respdl = await axiosGet(auth, `/v1/users/downline/${localStorage.getItem("base_id")}`)


            if (respdl) {
                for (let i = 0 ; i < respdl.data.length; i++) {
                    const dl = respdl.data[i]

                    if(dl.position === 'left') {    
                        setDlLeft(dl)
                        setShowLeft(true)
                    }
                    if(dl.position === 'center') {
                        setDlCenter(dl)
                        setShowCenter(true)
                    }
                    if(dl.position === 'right') {
                        setDlRight(dl)
                        setShowRight(true)
                    }
                }
            }

        } catch (err) {
            console.log(err.response)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
        { isLoading && <Loading/>}
        <NavigationBar/>
        <Box
            height="100vh"
            maxW={'7xl'}
            margin="auto"
        >

            <Flex justifyContent={'space-between'}>
                <Box
                    px={4}
                    py={6}
                >
                    <Text 
                        fontWeight={'bold'}
                        fontSize={textResponsive}    
                    >Halo, {userDetail?.fullname}</Text>
                </Box>
                <Box
                    px={4}
                    py={4}
                >
                    <Button
                        onClick={toWd}
                        bg={'#AA4A30'}
                        color={'white'}
                        fontSize={buttonResponsive}
                        _hover={{
                            bg: `#c25d42`
                        }}
                    >Ajukan Penarikan</Button>        
                </Box>

            </Flex>

            <HomeDownline 
                userDetail={baseId === userId ? userDetail : userShow} 
                downline={{left: dlLeft, center: dlCenter, right: dlRight}}
                showMore={{left: showLeft, center: showCenter, right: showRight}}
                isLoading={isLoading}
            />
        </Box>
        </>
    )
}

export { Home }