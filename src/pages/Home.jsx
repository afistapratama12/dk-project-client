import { useEffect, useState } from "react";
import { axiosGet, axiosPost } from "../API/axios";
import { useHistory } from "react-router-dom";

import { Box, Text, Flex, } from "@chakra-ui/layout"

import { NavigationBar } from "../components/Navbar.jsx"
import { HomeDownline } from "../components/HomeDownline";
import { Loading } from "../components/Loading";
import { Button,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, Input, FormLabel, useDisclosure, Spinner
} from "@chakra-ui/react";
import { buttonResponsive, textResponsive } from "../theme/font";
import swal from "sweetalert";

function Home() {
    const auth = localStorage.getItem("access_token")
    const role = localStorage.getItem("role")

    const history = useHistory()

    const baseId = localStorage.getItem("base_id")
    const userId = localStorage.getItem("id")

    const { isOpen, onOpen, onClose} = useDisclosure()

    const [selectBalance, setSelectBalance] = useState()
    const [loadingSend, setLoadingSend] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [sendTotal, setSendTotal] = useState()
    
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

    const toSendBalanceUser = (e) => {
        e.preventDefault()

        history.push("/user-send-balance")
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

    const handleClose = (e) => {
        e.preventDefault()

        onClose()
        setErrorMessage(null)
        setSelectBalance(undefined)
        setSendTotal(undefined)
    }

    const postBuyBalance = async (e) => {
        setLoadingSend(true)
        
        try {
            if (!selectBalance) {
                setErrorMessage("mohon pilih saldo yang akan dibeli")
            } else if (!sendTotal) {
                setErrorMessage("mohon masukkan jumlah saldo yang akan dibeli")
            } else if (selectBalance === "sas" && userDetail.money_balance < ((+sendTotal * 85000) + 300)) {
                setErrorMessage(`saldo keuangan anda tidak cukup untuk membeli ${sendTotal} SAS`)
            } else if (selectBalance === "ro" && userDetail.money_balance < ((+sendTotal * 130000) + 300)) {
                setErrorMessage(`saldo keuangan anda tidak cukup untuk membeli ${sendTotal} RO`)
            } else {
                if (selectBalance === "sas") {
                    const resp = await axiosPost(auth, `/v1/transaction/buy_sas_admin`, {
                        user_id : +userId,
                        sas_balance : +sendTotal,
                        money_balance: (+sendTotal * 85000) + 300
                    })

                    if (resp.status === 200) {
                        swal({
                            title: "Berhasil!",
                            text: `Pembelian Saldo SAS berhasil`,
                            icon: "success",
                            timer: 1500,
                            buttons: false, 
                        }).then(function() {
                            window.location.reload(true)
                        })
                    }
                } else if (selectBalance === "ro") {
                    const resp = await axiosPost(auth, `/v1/transaction/buy_ro_admin`, {
                        user_id : +userId,
                        ro_balance : +sendTotal,
                        money_balance: (+sendTotal * 130000) + 300
                    })

                    if (resp.status === 200) {
                        swal({
                            title: "Berhasil!",
                            text: `Pembelian Saldo RO berhasil`,
                            icon: "success",
                            timer: 1500,
                            buttons: false, 
                        }).then(function() {
                            window.location.reload(true)
                        })
                    }
                }
            }
        } catch (err) {
            if (err.response.status === 500) {
               console.log("masuk error 500")
                switch (err.response.data.errors) {
                    case "admin SAS insufficient balance":
                        setErrorMessage("<Text>terjadi kesalahan, persediaan saldo SAS admin tidak mencukupi. <br/> harap coba lagi nanti atau menghubungi admin<Text/>")
                        break
                    case "admin RO insufficient balance":
                        setErrorMessage("<Text>terjadi kesalahan, persediaan saldo RO admin tidak mencukupi. <br/> harap coba lagi nanti atau menghubungi admin<Text/>")
                        break
                    default:
                        setErrorMessage("<Text>terjadi kesalahan di internal sistem, mohon coba lagi nanti<Text/>")
                }
            }

            console.log(err.response)
        } finally {
            setLoadingSend(false)
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
            mb={10}
        >

            <Box
                px={4}
                py={6}
            >
            <Flex 
                justifyContent={'space-between'}
                direction={{
                    xl : "row",
                    md: "row",
                    sm: "column",
                    base: "column"
                }}
            >
                <Box
                >
                    <Text 
                        fontWeight={'bold'}
                        fontSize={textResponsive}    
                    >Halo, {userDetail?.fullname}</Text>
                </Box>


                {
                    role === "user" && (
                        <Flex
                        justifyContent={'space-evenly'}
                        pt={4}
                    >
                        <Box
                        >
                            <Button
                                onClick={toSendBalanceUser}
                                bg={'#AA4A30'}
                                color={'white'}
                                fontSize={buttonResponsive}
                                _hover={{
                                    bg: `#c25d42`
                                }}
                            >Kirim Saldo</Button>        
                        </Box>
                        <Box
                            pl={4}
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
                        <Box
                            pl={4}
                        >
                            <Button
                                onClick={onOpen}
                                bg={'#AA4A30'}
                                color={'white'}
                                fontSize={buttonResponsive}
                                _hover={{
                                    bg: `#c25d42`
                                }}
                            >Beli Saldo</Button>        
                        </Box>
                    </Flex>
                    )
                }

            </Flex>
            </Box>

            <HomeDownline 
                userDetail={baseId === userId ? userDetail : userShow} 
                downline={{left: dlLeft, center: dlCenter, right: dlRight}}
                showMore={{left: showLeft, center: showCenter, right: showRight}}
                isLoading={isLoading}
            />
        </Box>


        <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent
        >
          <ModalHeader
            fontSize={textResponsive}
          >Pembelian Saldo</ModalHeader>
          <ModalCloseButton onClick={handleClose}/>

          <Box
            pl={6}
            pr={6}
          >

            <Box>
                {
                    errorMessage && <Box
                    mb={2}
                    fontWeight={'bold'}
                    color={'red'}
                    fontSize={{
                        xl : '18px',
                        md: '18px',
                        sm: '16px',
                        base:"14px"
                    }}
                    dangerouslySetInnerHTML={{__html: errorMessage}}
                    ></Box>
                }
            </Box>

            <Box>
            <FormLabel
                fontSize={{
                    xl: '18px',
                    md: '18px',
                    sm: '16px',
                    base:'14px'
                }}
                mb={3}
            >Pilih Saldo</FormLabel>

                <Flex>
                    <Button
                        fontSize={buttonResponsive}
                        borderRadius={'15px'}
                        onClick={e => setSelectBalance("sas")}
                        bg={selectBalance === "sas" ? "yellow.700" : "gray.200"}
                        color={selectBalance === "sas" ? "gray.50" : "black"}
                        _hover={{
                            bg: selectBalance === "sas" ? "yellow.700" :  "gray.300"
                        }}
                    >Saldo SAS</Button>
                    <Button
                        ml={4}
                        fontSize={buttonResponsive}
                        borderRadius={'15px'}
                        onClick={e => setSelectBalance("ro")}
                        bg={selectBalance === "ro" ? "yellow.700" : "gray.200"}
                        color={selectBalance === "ro" ? "gray.50" : "black"}
                        _hover={{
                            bg: selectBalance === "ro" ? "yellow.700" :  "gray.300"
                        }}
                    >Saldo RO</Button>
                </Flex>
            </Box>

            <FormLabel
                mt={2}
                fontSize={{
                    xl: '18px',
                    md: '18px',
                    sm: '16px',
                    base:'14px'
                }}
            >Masukkan Jumlah</FormLabel>
            <Input
                type='text'
                onChange={e => setSendTotal(e.target.value)}
                value={sendTotal}
                placeholder={'misal: 2'}
            />
            <Box
                pt={4}
                align={'center'}
            >
                <Button 
                    fontSize={{
                        xl : '18px',
                        md: '18px',
                        sm: '16px',
                        base:"14px"
                    }}
                    bg={'yellow.400'}
                    _hover={{
                        bg: "yellow.500"
                    }}
                    fontWeight={'bold'}
                    onClick={postBuyBalance}
                    width={'100px'}
                >{loadingSend ? <Spinner/> : "kirim"}</Button>
            </Box>

            <Text
                fontSize={{
                    xl: '14px',
                    base:'11px'
                }}
                mt={2}
            >catatan: </Text>
            <Text
                    fontSize={{
                    xl: '14px',
                    sm:'10px',
                    base:'10px'
                }}                           
            >- harga SAS berkelipatan 85.000 rupiah per saldo, untuk RO berkelipatan 130.000 rupiah per saldo</Text>
            <Text
                fontSize={{
                    xl: '14px',
                    sm:'10px',
                    base:'10px'
                }}
            >- pembelian saldo akan memotong saldo keuangan sebesar 300 rupiah untuk biaya admin</Text>
            <Text
                fontSize={{
                    xl: '14px',
                    sm:'10px',
                    base:'10px'
                }}
            >contoh: membeli 1 SAS, maka akan mengurangi saldo keuangan sebesar 85.300</Text>
        </Box>

          <ModalFooter>
            <Button 
                color={'white'}
                bg={'#AA4A30'}
                _hover={{
                bg: 'yellow.500',
                }}
                fontSize={buttonResponsive}
                 mr={3} onClick={handleClose}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}

export { Home }