import { Box, Button, Flex, Text ,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, Input, FormLabel, useDisclosure, Spinner
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import swal from "sweetalert"
import { axiosGet, axiosPost } from "../API/axios"
import { Loading } from "../components/Loading"

import { NavigationBar } from "../components/Navbar.jsx"
import { formatMoney, getTotalBalanceInOut } from "../helper/helper"

import { buttonResponsive, textResponsive } from "../theme/font.jsx"
import { TableProps, Tbody, Td, Th, Thead, Tr } from "../uikit/TableProps"

function StockProduct() {
    const auth = localStorage.getItem("access_token")

    const { isOpen, onOpen, onClose} = useDisclosure()

    const [admin, setAdmin] = useState()
    const [loading, setLoading] = useState(false)
    const [SAStransactions, setSASTransactions] = useState()
    const [ROtransactions, setROTransactions] = useState()

    const [addbalance, setAddBalance] = useState({
        sas_balance : "",
        ro_balance: ""
    })

    const [loadingSend, setLoadingSend] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)

    const [filterBalance, setFilterBalance] = useState("sas")


    const getAdminData = async (e) => {
        setLoading(true)
        
        try {
            const resp = await axiosGet(auth, "/v1/users/self")
            
            const SAS = await axiosGet(auth, `/v1/transaction/sas_balance`)
            const RO = await axiosGet(auth, `/v1/transaction/ro_balance`)
            
            setAdmin(resp.data)
            setSASTransactions(SAS.data)
            setROTransactions(RO.data)

        } catch (err) {
            console.log(err.response)
        } finally {
            setLoading(false)
        }
    }

    console.log(addbalance)

    console.log(ROtransactions)
    console.log(SAStransactions)

    useEffect(() => {
        getAdminData()
    },[])

    const postAddBalance = async (e) => {  
        setLoadingSend(true)
       
        try {
            const resp = await axiosPost(auth, `/v1/transaction/add_balance_admin`, {
                sas_balance: addbalance.sas_balance ? +addbalance.sas_balance : 0,
                ro_balance: addbalance.ro_balance ? +addbalance.ro_balance: 0
            })

            if (resp.status === 200) {
                swal({
                    title: "Berhasil!",
                    text: `Berhasil menambah saldo`,
                    icon: "success",
                    timer: 1500,
                    buttons: false,
                }).then(function() {
                    window.location.reload(true)
                })
            }

        } catch (err) {
            console.log(err)
        } finally {
            setLoadingSend(false)
        }
    }

    const handleClose = (e) => {
        e.preventDefault()
        
        onClose()
        setErrorMsg(null)
    }

    return (
        <>

        { loading && <Loading/>}

        <NavigationBar/>

        <Box maxW={'7xl'} margin={'auto'}>
            <Box px={6} pt={1} mt={1}>
                    <Flex 
                        justifyContent={'space-between'}
                    >
                        <Box
                            pt={1}
                        >
                            <Text 
                                fontWeight={'bold'}
                                fontSize={textResponsive}
                            >Saldo Admin
                            </Text>
                        </Box>

                        <Button 
                            borderRadius={'15px'} 
                            h={'5vh'} 
                            bg={'yellow.600'} 
                            color={'white'}
                            fontSize={buttonResponsive}
                            _hover={{
                                bg: "yellow.500"
                            }}
                            onClick={onOpen}
                            >Tambah</Button>
                    </Flex>



                    <Box mt={4}>
                        <Flex ml={-2}>
                            <Box
                                align={'center'}
                                bg={'yellow.400'}
                                borderRadius={'15px'}
                                py={2}
                                px={4}
                                w={"200px"}
                                fontSize={textResponsive}
                            >
                                <Flex justifyContent={'space-between'}>
                                    <Text 
                                        fontSize={{
                                            base: '12px',
                                            sm: "12px",
                                            md: '14px',
                                            lg: '18px'
                                        }}
                                    
                                    >Saldo SAS :</Text>
                                    <Text
                                        fontSize={{
                                            base: '12px',
                                            sm: "12px",
                                            md: '14px',
                                            lg: '18px'
                                        }}
                                    >{formatMoney(admin?.sas_balance)}</Text>
                                </Flex>
                            </Box>
                            <Box
                                ml={2}
                                borderRadius={'15px'}
                                bg={'yellow.400'}
                                align={'center'}
                                py={2}
                                px={4}
                                w={"200px"}
                                fontSize={textResponsive}
                            >   
                                <Flex justifyContent={'space-between'}>
                                    <Text
                                        fontSize={{
                                            base: '12px',
                                            sm: "12px",
                                            md: '14px',
                                            lg: '18px'
                                        }}
                                    >Saldo RO :</Text>
                                    <Text
                                        fontSize={{
                                            base: '12px',
                                            sm: "12px",
                                            md: '14px',
                                            lg: '18px'
                                        }}
                                    >{formatMoney(admin?.ro_balance)}</Text>
                                </Flex>
                            </Box>
                        </Flex>
                    </Box>
            </Box>

            <Box mt={3} ml={4} px={5} pt={1} maxW={'335px'} bg={'yellow.400'} borderRadius={'15px'}>
                <TableProps>
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th align={'center'}>Penambahan</Th>
                            <Th align={'center'}>Pengurangan</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>SAS</Td>
                            <Td align={'right'}>{SAStransactions && formatMoney(getTotalBalanceInOut(SAStransactions, "sas", "in"))}</Td>
                            <Td align={'right'}>{SAStransactions && formatMoney(getTotalBalanceInOut(SAStransactions, "sas", "out"))}</Td>
                        </Tr>
                        <Tr>
                            <Td>RO</Td>
                            <Td align={'right'}>{ROtransactions && formatMoney(getTotalBalanceInOut(ROtransactions, "ro", "in"))}</Td>
                            <Td align={'right'}>{ROtransactions && formatMoney(getTotalBalanceInOut(ROtransactions, "ro", "our"))}</Td>
                        </Tr>
                    </Tbody>
                </TableProps>
                
            </Box>


            <Box mt={4} ml={4}>
            <Flex>
                <Box
                    p={2}
                    mr={3}
                >
                    <Text fontWeight={'bold'}>Filter</Text>
                </Box>
                <Box>
                    <Button 
                        onClick={e => setFilterBalance("sas")}
                        bg={filterBalance === 'sas' ? "#AA4A30" : "gray.200"}
                        color={filterBalance === 'sas' ? "gray.50" : "black"}
                        _hover={{
                            bg: filterBalance === 'sas' ? "#AA4A30" :  "gray.300"
                        }}    
                        fontSize={buttonResponsive} 
                    >Saldo SAS</Button>
                    <Button 
                        onClick={e => setFilterBalance("ro")} 
                        ml={2}
                        bg={filterBalance === 'ro' ? "#AA4A30" : "gray.200"}
                        color={filterBalance === 'ro' ? "gray.50" : "black"}
                        _hover={{
                            bg: filterBalance === 'ro' ? "#AA4A30" :  "gray.300"
                        }}
                        fontSize={buttonResponsive}    
                    >Saldo RO</Button>
                </Box>
            </Flex>
            </Box>

            <Box mt={3}>
            <TableProps>
                    <Thead>
                        <Tr>
                            <Th>No</Th>
                            <Th>Tanggal</Th>
                            <Th>Deskripsi</Th>
                            <Th>Saldo</Th>
                            <Th>Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            filterBalance === "ro" ? ROtransactions?.map((b, id) => (
                                <Tr key={id}>
                                    <Td>{id+1}</Td>
                                    <Td>{b.created_at}</Td>
                                    <Td>{b.description}</Td>
                                    <Td>{b.ro_balance}</Td>
                                    <Td>
                                        <Box
                                            borderRadius={'15px'}
                                            fontSize={buttonResponsive}
                                            bg={b.to_id === 1 ? "green.400" : "pink.500"}
                                            fontWeight={'bold'}
                                            color={'white'}
                                            p={2}
                                        >
                                            <Text>{b.to_id === 1 ? "Tambah" : "Kurang"}</Text>
                                        </Box>               
                                    </Td>
                                </Tr>
                            )) : SAStransactions?.map((b, id) => (
                                <Tr key={id}>
                                <Td>{id+1}</Td>
                                    <Td>{b.created_at}</Td>
                                    <Td>{b.description}</Td>
                                    <Td>{b.sas_balance}</Td>
                                    <Td>
                                        <Box
                                            borderRadius={'15px'}
                                            fontSize={buttonResponsive}
                                            bg={b.to_id === 1 ? "green.400" : "pink.500"}
                                            fontWeight={'bold'}
                                            color={'white'}
                                            p={2}
                                        >
                                            <Text>{b.to_id === 1 ? "Tambah" : "Kurang"}</Text>
                                        </Box>               
                                    </Td>
                                </Tr>
                            ))
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
          <ModalCloseButton onClick={handleClose} />

          <Box
            pl={6}
            pr={6}
          >

            <Box>
                {
                    errorMsg && <Text
                    mb={2}
                    fontWeight={'bold'}
                    color={'red'}
                    fontSize={{
                        xl : '18px',
                        md: '18px',
                        sm: '16px',
                        base:"14px"
                    }}
                    >{errorMsg}</Text>
                }
            </Box>

            <FormLabel
                fontSize={{
                    xl: '18px',
                    md: '18px',
                    sm: '16px',
                    base:'14px'
                }}
            >Tambah Saldo SAS</FormLabel>
            <Input
                type='text'
                onChange={e => setAddBalance({...addbalance, sas_balance: e.target.value})}
                value={addbalance.sas_balance}
            />

            <FormLabel
                fontSize={{
                    xl: '18px',
                    md: '18px',
                    sm: '16px',
                    base:'14px'
                }}
            >Tambah Saldo RO</FormLabel>
            <Input
                type='text'
                onChange={e => setAddBalance({...addbalance, ro_balance: e.target.value})}
                value={addbalance.ro_balance}
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
                    onClick={postAddBalance}
                    width={'100px'}
                >{loadingSend ? <Spinner/> : "Kirim"}</Button>
            </Box>
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

export { StockProduct}