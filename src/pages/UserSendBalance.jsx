import { Box, Button, Flex, Text,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, Input, FormLabel, useDisclosure, Spinner, chakra, InputGroup, InputLeftElement
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import swal from "sweetalert"
import { axiosGet, axiosPost } from "../API/axios.js"
import { Loading } from "../components/Loading.jsx"
import { NavigationBar } from "../components/Navbar.jsx"
import { handleShowSend } from "../helper/helper.js"
import { TableProps, Tbody, Td, Th, Thead, Tr } from "../uikit/TableProps.js"

import { useHistory } from 'react-router-dom'

import { FaSearch } from "react-icons/fa"
import { textResponsive, buttonResponsive } from "../theme/font.jsx"

const CFaSearch = chakra(FaSearch);

function UserSendBalance({userDetail, loadingUDetail}) {
    const auth = localStorage.getItem("access_token")
    const userId = localStorage.getItem("id")

    const history = useHistory()

    const { isOpen, onOpen, onClose} = useDisclosure()

    const [errorMessage, setErrorMessage] = useState(null)

    const [selectSend, setSelectSend] = useState({
        money: false,
        ro: false,
        sas: false,
    })

    const [usertoSend, setUserToSend] = useState()
    const [sendTotal, setSendTotal] = useState()

    const [filterOn, setFilterOn] = useState(false)
    const [filterName, setFilterName] = useState()
    const [filterData, setFilterData] = useState()

    const [loading, setLoading] = useState(false)
    const [loadingSend, setLoadingSend] = useState(false)

    const [allUser, setAllUser] = useState()

    const getAllUser = async () => {
        setLoading(true)

        try {
            const { data } = await axiosGet(auth, `/v1/users/by_user`)
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

        if (!sendTotal) {
            setErrorMessage("mohon isi saldo terlebih dahulu")
        } else if (selectSend.money && +sendTotal < 1000) {
            setErrorMessage("mohon masukkan saldo minimal 1000 rupiah")
        } else if(selectSend.money && (+sendTotal + 300) > userDetail?.money_balance) {
            setErrorMessage("Saldo tidak cukup, pastikan ada saldo untuk penarikan biaya admin")
        } else {
            setLoadingSend(true)
            try {
                const postData = {from_id: +userId, to_id: +usertoSend}
    
                if (selectSend.money) {
                    postData["money_balance"] = (+sendTotal + 300)
                    postData["description"] = "kirim saldo keuangan ke member lain"
                    postData["category"] = "umum"
                }
        
                if (selectSend.sas) {
                    postData["sas_balance"] = +sendTotal
                    postData["description"] = "kirim saldo SAS ke member lain"
                    postData["category"] = "umum"
                }
        
                if (selectSend.ro) {
                    postData["ro_balance"] = +sendTotal
                    postData["description"] = "kirim saldo RO ke member lain"
                    postData["category"] = "umum"
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
                if (err?.response?.status === 500) {
                    const errBalance = ["SASBalance", "ROBalance", "MoneyBalance"]
                    const check = errBalance.some(el => err.response.data.message.includes(el))
                    if (check) {
                        setErrorMessage("Saldo tidak cukup, pastikan ada saldo untuk penarikan biaya admin")
                    }
                }
            } finally {
                setUserToSend(null)
                setSendTotal(null)
                setLoadingSend(false)
            }

        }
    }

    useEffect(() => {
        getAllUser()
    },[])

    const handleFilterData = (e) => {
        e.preventDefault()

        if (e.key === "Enter") {
            setFilterData(allUser.filter(user => user.fullname.includes(filterName ?? "")))
            setFilterOn(true)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()

        setFilterData(allUser.filter(user => user.fullname.includes(filterName ?? "")))
        setFilterOn(true)
    }

    const handleClose = () => {
        // e.preventDefault()
        if (loadingSend) {
            return
        }

        onClose()

        setErrorMessage(null)
    }

    const backHome = (e) => {
        e.preventDefault()

        history.push("/")
    }

    console.log(allUser)

    return (
        <>
        { (loading || loadingUDetail) && <Loading/>}

        <NavigationBar/>
        
        <Box maxW={'7xl'} margin='auto' pt={2}>
            <Box>
                <Box px={6} pt={1}>
                    <Flex
                        justifyContent={'space-between'}
                    >
                        <Text 
                            fontWeight={'bold'}
                            fontSize={textResponsive}
                        >Pilih Saldo</Text>

                        <Button
                            borderRadius={'15px'}
                            color={'white'}
                            bg={'#AA4A30'}
                            _hover={{
                              bg: 'yellow.500',
                            }}
                            p={2}
                            w={'80px'}
                            fontSize={buttonResponsive}
                            onClick={backHome}
                        >
                            Kembali
                        </Button>
                    </Flex>
                </Box>
                <Box
                    mt={2}
                >
                    <Flex>
                    <Button 
                        ml={{
                            base: 2
                        }}
                        fontSize={buttonResponsive}
                        borderRadius={'15px'} 
                        onClick={e => setSelectSend({money: true, ro: false, sas: false})}    
                        bg={selectSend.money ? "yellow.700" : "gray.200"}
                        color={selectSend.money ? "gray.50" : "black"}
                        _hover={{
                            bg: selectSend.money ? "yellow.700" :  "gray.300"
                        }}
                    >Saldo Keuangan</Button>
                    <Button 
                        ml={2} 
                        fontSize={buttonResponsive}
                        borderRadius={'15px'}
                        onClick={e => setSelectSend({money: false, ro: true, sas: false})}
                        bg={selectSend.ro ? "yellow.700" : "gray.200"}
                        color={selectSend.ro ? "gray.50" : "black"}
                        _hover={{
                            bg: selectSend.ro ? "yellow.700" :  "gray.300"
                        }}
                    >Saldo Repeat Order</Button>
                    <Button 
                        ml={2} 
                        fontSize={buttonResponsive}
                        borderRadius={'15px'}
                        onClick={e => setSelectSend({money: false, ro: false, sas: true})}
                        bg={selectSend.sas ? "yellow.700" : "gray.200"}
                        color={selectSend.sas ? "gray.50" : "black"}
                        _hover={{
                            bg: selectSend.sas ? "yellow.700" :  "gray.300"
                        }}
                    >Saldo SAS</Button>
                    </Flex>
                </Box>
            </Box>


            <Box px={6} pt={1} mt={3}>
                <Flex
                    justifyContent={'space-between'}
                >
                    <Text
                        fontWeight={'bold'}
                        fontSize={textResponsive}
                        pt={2}
                    >Pilih Pengguna
                    </Text>

                    <Box
                        display={'flex'}
                        flexDirection={'row'}
                        ml={-4}
                    >
                        <InputGroup
                            width={{
                                xl: '20vw',
                                md: '20vw',
                                sm: '30vw',
                                base: '38vw'
                            }}
                            borderRadius={'15px'}
                            bg={'gray.100'}
                        >
                            <InputLeftElement
                                fontSize={{
                                    xl: '18px',
                                    md: '18px',
                                    sm: '14px',
                                    base: '11px'
                                }}
                                width={{
                                    base: "30px"
                                }}
                                pointerEvents="none"
                                children={<CFaSearch color="gray.500" />}
                            />
                            <Input 
                                pl={6}
                                type="text"
                                placeholder="cari nama lengkap" 
                                fontSize={{
                                    xl: '18px',
                                    md: '18px',
                                    sm: '14px',
                                    base: '11px'
                                }}
                                onChange={e =>  setFilterName(e.target.value)}
                                value={filterName}
                                onKeyUp={handleFilterData}
                                
                            />

                        </InputGroup>
                        <Box
                            ml={2}
                        >
                            <Button
                                onClick={handleSearch}
                                color={'white'}
                                bg={'#AA4A30'}
                                _hover={{
                                  bg: 'yellow.500',
                                }}
                                borderRadius={'15px'}
                                fontSize={buttonResponsive}
                            >Cari</Button>
                        </Box>
                    </Box>
                </Flex>

            </Box>

            <Box px={4} pt={2}>
            
            <TableProps>
                    <Thead>
                        <Tr>
                            <Th width={'15%'} pl={-1}>No</Th>
                            <Th width={'40%'} pl={-1}>Nama Lengkap</Th>
                            <Th width={'20%'} align="center">Status</Th>
                            <Th pl={-1}></Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            !filterOn ? allUser?.map((user, id) => (
                                <Tr key={id}>
                                    <Td pl={-1}>{id+1}</Td>
                                    <Td pl={-1}>{user.fullname}</Td>
                                    <Td whiteSpace={'nowrap'} >
                                        <Button
                                            fontSize={buttonResponsive}
                                            borderRadius={'15px'}
                                            align={'center'}
                                            bg={user.id === 1 ? 'red.300' : "green.300"}
                                            _hover={{
                                                bg: user.id === 1 ? 'red.300' : "green.300"
                                            }}
                                            _active={{
                                                bg:user.id === 1 ? 'red.300' : "green.300"
                                            }}
                                            cursor={'default'}
                                            h={{
                                                xl: '50px',
                                                sm: '9vw',
                                                base: '9vw'
                                            }}
                                        >
                                            {user.id === 1 ? "ADMIN" : "USER"}
                                        </Button>
                                    </Td>
                                    <Td>
                                        <Button
                                            fontSize={buttonResponsive}
                                            onClick={e => handleChoose(e, user.id)}
                                        >Pilih</Button>
                                    </Td>
                                </Tr>
                            )) : filterData.length !== 0 ? filterData?.map((user, id) => (
                                <Tr key={id}>
                                    <Td pl={-1}>{id+1}</Td>
                                    <Td pl={-1}>{user.fullname}</Td>
                                    <Td whiteSpace={'nowrap'} align={'center'}>
                                        <Button
                                            fontSize={buttonResponsive}
                                            borderRadius={'15px'}
                                            align={'center'}
                                            bg={user.id === 1 ? 'red.300' : "green.300"}
                                            _hover={{
                                                bg:user.id === 1 ? 'red.300' : "green.300"
                                            }}
                                            _active={{
                                                bg:user.id === 1 ? 'red.300' : "green.300"
                                            }}
                                            cursor={'default'}
                                            h={{
                                                xl: '50px',
                                                sm: '9vw',
                                                base: '9vw'
                                            }}
                                        >
                                            {user.id === 1 ? "ADMIN" : "USER"}
                                        </Button>
                                    </Td>
                                    <Td>
                                        <Button
                                            fontSize={buttonResponsive}
                                            onClick={e => handleChoose(e, user.id)}
                                        >Pilih</Button>
                                    </Td>
                                </Tr>
                            )) : <Box
                                    align={'center'}
                                    top="calc(50% - (58px / 2))" 
                                    right="calc(50% - (180px / 2))"
                                    position="fixed"
                                    // width={'90vw'}
                                    height={'30vh'}
                                >
                                <Text
                                    fontWeight={'bold'}
                                    fontSize={textResponsive}
                                >Data tidak ditemukan</Text>
                                </Box>
                        }
                    </Tbody>
            </TableProps>
            </Box>
        </Box>    


        <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent
        >
          <ModalHeader
            fontSize={textResponsive}
          >Kirim Saldo</ModalHeader>
          <ModalCloseButton onClose={handleClose} />

          <Box
            pl={6}
            pr={6}
          >

            <Box>
                {
                    errorMessage && <Text
                    mb={2}
                    fontWeight={'bold'}
                    color={'red'}
                    fontSize={{
                        xl : '18px',
                        md: '18px',
                        sm: '16px',
                        base:"14px"
                    }}
                    >{errorMessage}</Text>
                }
            </Box>

            <FormLabel
                fontSize={{
                    xl: '18px',
                    md: '18px',
                    sm: '16px',
                    base:'14px'
                }}
            >Kirim Saldo {handleShowSend(selectSend)}</FormLabel>
            <Input
                type='text'
                onChange={e => setSendTotal(e.target.value)}
                value={sendTotal}
                placeholder={selectSend.money? "misal: 1000" : "misal: 2"}
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
                    onClick={postTransaction}
                    width={'100px'}
                >{loadingSend ? <Spinner/> : "kirim"}</Button>
            </Box>

            {
                selectSend.money &&  (
            <Box mt={2}>
                <Text
                    fontSize={{
                        xl : '14px',
                        md: "14px",
                        sm: "11px",
                        base: "11px"
                    }}
                
                >Catatan : setiap transaksi keuangan akan dipotong biaya admin sebesar 300 rupiah dari saldo, pastikan saldo mencukupi.</Text>
                <Text
                    fontSize={{
                        xl : '14px',
                        md: "14px",
                        sm: "11px",
                        base: "11px"
                    }}
                
                >contoh : mengirim saldo keuangan Rp 2.000, maka akan mengurangi saldo Rp 2.300 </Text>
            </Box>
                )
            }

            
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

export { UserSendBalance }