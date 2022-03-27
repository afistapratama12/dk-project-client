import { Box, Button, Flex, Table, Tbody, Td, Text, Th, Thead, Tr,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, Input, FormLabel, useDisclosure, Spinner
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import swal from "sweetalert"
import { axiosGet, axiosPost } from "../API/axios.js"
import { Loading } from "../components/Loading.jsx"
import { NavigationBar } from "../components/Navbar.jsx"
import { handleShowSend } from "../helper/helper.js"


function SendBalance() {
    const auth = localStorage.getItem("access_token")

    const { isOpen, onOpen, onClose} = useDisclosure()

    const [selectSend, setSelectSend] = useState({
        money: false,
        ro: false,
        sas: false,
    })

    const [usertoSend, setUserToSend] = useState()
    const [sendTotal, setSendTotal] = useState()

    const [loading, setLoading] = useState(false)
    const [loadingSend, setLoadingSend] = useState(false)

    const [allUser, setAllUser] = useState()

    const getAllUser = async () => {
        setLoading(true)

        try {
            const { data } = await axiosGet(auth, `/v1/users`)

            setAllUser(data)

        } catch (err) {
            console.log(err.response)
        } finally {
            setLoading(false)
        }
    }

    const handleChoose = (e, id) => {
        e.preventDefault()

        if (!selectSend.sas && !selectSend.ro && !selectSend.money) {
            swal({
                title: "Perhatian !",
                text: `Mohon pilih jenis saldo yang akan dikirim`,
                icon: "warning",
                buttons: true,
            })
        } else {
            setUserToSend(id)
            onOpen()    
        }


    }

    const postTransaction = async (e, id) => {
        e.preventDefault()

        setLoadingSend(true)
        try {
            const postData = {from_id: 1, to_id: +usertoSend}

            if (selectSend.money) {
                postData["money_balance"] = +sendTotal
            }
    
            if (selectSend.sas) {
                postData["sas_balance"] = +sendTotal
            }
    
            if (selectSend.ro) {
                postData["ro_balance"] = +sendTotal
            }
    
            const resp = await axiosPost(auth, `/v1/transaction/record`, postData) 

            if (resp.status === 201) {
                onClose()

                swal({
                    title: "Berhasil!",
                    text: `Saldo berhasi terkirim`,
                    icon: "success",
                    timer: 1500,
                    buttons: false,
                })
            }
        } catch (err) {
            console.log(err.response)
        } finally {
            setUserToSend(null)
            setSendTotal(null)
            setLoadingSend(false)
        }
    }

    console.log("user send", usertoSend)
    console.log("send total", sendTotal)

    useEffect(() => {
        getAllUser()
    },[])

    const handleSendMoney = (e, flag) =>  {
        e.preventDefault()

        switch (flag) {
            case "money":
                setSelectSend({money: true, ro: false, sas: false})
                break;
            case "ro":
                setSelectSend({money: false, ro: true, sas: false})
                break;
            case "sas":
                setSelectSend({money: false, ro: false, sas: true})
                break;
            default:
                break;
        }
    }

    return (
        <>
        { loading && <Loading/>}

        <NavigationBar/>
        
        <Box maxW={'7xl'} margin='auto' pt={2}>
        <Flex>
                <Box px={6} pt={1}>
                    <Text 
                        fontWeight={'bold'}
                        fontSize={'20px'}
                    >Pilih Saldo</Text>
                </Box>
                <Button 
                    borderRadius={'15px'} 
                    onClick={e => handleSendMoney(e, "money")}    
                    bg={selectSend.money ? "yellow.700" : "gray.200"}
                    color={selectSend.money ? "gray.50" : "black"}
                    _hover={{
                        bg: selectSend.money ? "yellow.700" :  "gray.300"
                    }}
                >Saldo Keuangan</Button>
                <Button 
                    ml={2} 
                    borderRadius={'15px'}
                    onClick={e => handleSendMoney(e, "ro")}
                    bg={selectSend.ro ? "yellow.700" : "gray.200"}
                    color={selectSend.ro ? "gray.50" : "black"}
                    _hover={{
                        bg: selectSend.ro ? "yellow.700" :  "gray.300"
                    }}
                >Saldo Repeat Order</Button>
                <Button 
                    ml={2} 
                    borderRadius={'15px'}
                    onClick={e => handleSendMoney(e, "sas")}
                    bg={selectSend.sas ? "yellow.700" : "gray.200"}
                    color={selectSend.sas ? "gray.50" : "black"}
                    _hover={{
                        bg: selectSend.sas ? "yellow.700" :  "gray.300"
                    }}
                >Saldo SAS</Button>
            </Flex>


            <Box px={6} pt={1}>
                <Text
                    fontWeight={'bold'}
                    fontSize={'20px'}
                >Pilih Pengguna</Text>
            </Box>

            <Box px={4} pt={2}>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>No</Th>
                        <Th>Nama Lengkap</Th>
                        <Th>No Telp</Th>
                        <Th></Th>
                    </Tr>
                </Thead>
                <Tbody>
                { allUser?.map((user, id) => (
                    <Tr key={id}>
                        <Td>{id+1}</Td>
                        <Td>{user.fullname}</Td>
                        <Td>{user.phone_number}</Td>
                        <Td>
                            <Button onClick={e => handleChoose(e, user.id)}>
                                Pilih
                            </Button>
                        </Td>
                    </Tr>
                ))} 
                </Tbody>
            </Table>
            </Box>
        </Box>    


        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
        >
          <ModalHeader>Kirim Saldo</ModalHeader>
          <ModalCloseButton />

          <Box
            pl={6}
            pr={6}
          >

            <FormLabel>Kirim Saldo {handleShowSend(selectSend)}</FormLabel>
            <Input
                type='text'
                onChange={e => setSendTotal(e.target.value)}
                value={sendTotal}
            />
            <Box
                pt={4}
                align={'center'}
            >
                <Button 
                    fontWeight={'bold'}
                    onClick={postTransaction}
                >{loadingSend ? <Spinner/> : "kirim"}</Button>
            </Box>
          </Box>
          <ModalFooter>
            <Button colorScheme='pink' mr={3} onClick={onClose}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}

export { SendBalance }