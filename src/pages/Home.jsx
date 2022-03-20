import { useEffect, useState } from "react";
import { axiosGet } from "../API/axios";

import { Box, Text } from "@chakra-ui/layout"

import { NavigationBar } from "../components/Navbar.jsx"
import { HomeDownline } from "../components/HomeDownline";
import { Loading } from "../components/Loading";


function Home() {
    const auth = localStorage.getItem("access_token")

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

        <Box>
            <Text fontWeight={'bold'}>Halo, {userDetail?.fullname}</Text>
        </Box>        

        { userDetail && <HomeDownline 
            userDetail={baseId === userId ? userDetail : userShow} 
            downline={{left: dlLeft, center: dlCenter, right: dlRight}}
            showMore={{left: showLeft, center: showCenter, right: showRight}}
            isLoading={isLoading}
            />
        }
        </>
    )
}

export { Home }