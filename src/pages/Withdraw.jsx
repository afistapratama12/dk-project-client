import { Box, Button, Collapse, Flex, FormLabel, Input, Modal, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import swal from "sweetalert"
import { axiosGet, axiosPost, axiosPut } from "../API/axios"
import { Loading } from "../components/Loading"
import { NavigationBar } from "../components/Navbar.jsx"
import { formatMoney } from "../helper/helper"
import { buttonResponsive, textResponsive } from "../theme/font"
import { TableProps, Tbody, Td, Th, Thead, Tr } from "../uikit/TableProps"

import { useHistory } from 'react-router-dom'


export function TableWithdraw({ wdReqHistory }) {
    return(
        <Box>
            <Text 
                fontWeight={'bold'}
                fontSize={textResponsive}
                >Riwayat Penarikan Anda
            </Text>


            <TableProps>
                <Thead>
                    <Tr>
                        <Th width={'10%'} pl={-1}>No</Th>
                        <Th width={'20%'}>Penarikan Uang</Th>
                        <Th width={'20%'}>Penarikan RO</Th>
                        <Th>Bonus RO dan Jaringan</Th>
                        <Th align={'center'}>Status</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        wdReqHistory?.map((wdReq, id) => (
                            <Tr key={id}>
                                <Td width={'12%'} pl={-1}>{id+1}</Td>
                                <Td align={'right'}>{formatMoney(wdReq.money_balance)}</Td>
                                <Td align={'right'}>{formatMoney(wdReq.ro_balance)}</Td>
                                <Td align={'right'}>{formatMoney(wdReq.ro_money_balance)}</Td>
                                <Td align={'center'}>  
                                    <Box
                                        p={2}
                                        bg={wdReq.approved ? "yellow.500" : "orange.50"}
                                        color={wdReq.approved ? "white" : "gray.800"}
                                        borderRadius={'15px'}
                                    >
                                        { wdReq.approved ? "Terkirim" : "Pending"}
                                    </Box>

                                </Td>
                            </Tr>
                        ))
                    }
                </Tbody>
            </TableProps>
        </Box>
    )
}

function Withdraw() {
    const auth = localStorage.getItem("access_token")
    const history = useHistory()

    const { isOpen, onOpen, onClose} = useDisclosure()

    const [loading, setLoading] = useState(false)

    const [userDetail, setUserDetail] = useState();
    const [bankInfo, setBankInfo ] = useState()
    const [wdReqHistory, setWqReqHistory] = useState()

    // for create bank account
    const [newBankData, setNewBankData] = useState({
        user_id: 0, 
        bank_name: "", 
        bank_number: "", 
        name_on_bank: ""
    })
    const [errorMessage, setErrorMessage] = useState(null)
    const [loadingCreate, setLoadingCreate] = useState(false)

    const [openWd, setOpenWd] = useState(false)
    const [openedWd, setOpenedWd] = useState("")

    const [newReqBalance, setNewReqBalance] = useState()

    const getBankAccInfo = async () => {
        setLoading(true)

        try {
            const respUser = await axiosGet(auth, `/v1/users/self`)

            setUserDetail(respUser.data)

            const respBankInfo = await axiosGet(auth, `/v1/bank_account`)

            console.log("dapat resp bank info", respBankInfo)

            if (respBankInfo.data.id !== 0 && respBankInfo.data.user_id !== 0) {
                setBankInfo(respBankInfo?.data)
            }

            const respWR = await axiosGet(auth, `/v1/withdraws/${localStorage.getItem("id")}`)
            setWqReqHistory(respWR?.data)

        } catch (err) {
            console.log(err?.response)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getBankAccInfo()
    },[])

    const handleBankData = (e) => {
        e.preventDefault()
        if (bankInfo) {
            setNewBankData({ 
                user_id: +userDetail.id, 
                bank_name: bankInfo.bank_name, 
                bank_number: bankInfo.bank_number,
                name_on_bank: bankInfo.name_on_bank
            })
        }

        onOpen()
    }

    const postNewReq = async (e) => {
        e.preventDefault()
        setLoadingCreate(true)

        let flag = true
        let req

        if (openedWd === "money") {
            if (newReqBalance.money_balance > userDetail.money_balance) {
                setErrorMessage("Saldo keuangan tidak mencukupi")
                flag = false
            } else {
                req = {...newReqBalance, money_balance : +newReqBalance.money_balance}
            }
        } else if (openedWd === "ro") {
            if (newReqBalance.ro_balance > userDetail.ro_balance) {
                setErrorMessage("Saldo repeat order tidak mencukupi")
                flag= false
            } else {
                req = {...newReqBalance, ro_balance: +newReqBalance.ro_balance}
            }
        } 

        if (flag) {
            try {     
                const resp = await axiosPost(auth, `/v1/withdraws`, req)

                if (resp.status === 201) {
                    swal({
                        title: "Berhasil!",
                        text: `Berhasil melakukan request penarikan saldo`,
                        icon: "success",
                        timer: 1500,
                        buttons: false, 
                    }).then(function() {
                        window.location.reload(true)
                    })
                }
            } catch (err) {
                console.log(err?.response)
            } finally {
                setLoadingCreate(false)
            }
        } else {
            setLoadingCreate(false)
        }
    }

    // isHaveBankData : true | false
    const postNewBankData = async (e, isHaveBankInfo) => {
        e.preventDefault()

        console.log(isHaveBankInfo)

        if (newBankData.bank_name === "") {
            setErrorMessage("Mohon isi nama bank")
        } else if (newBankData.bank_number === "") {
            setErrorMessage("Mohon isi nomer rekening")
        } else if (newBankData.name_on_bank === "") {
            setErrorMessage("Mohon isi nama rekening / atas nama")
        } else {
            setLoadingCreate(true)
            try {
                if (isHaveBankInfo) {
                   const resp =  await axiosPut(auth, `/v1/bank_account/${bankInfo.id}`, newBankData)

                   console.log(resp)
                   if (resp.status === 200 && resp.statusText === "OK") {
                        onClose()
                        setErrorMessage(null)

                        swal({
                            title: "Berhasil!",
                            text: `Data bank berhasil diperbarui`,
                            icon: "success",
                            timer: 1500,
                            buttons: false, 
                        }).then(function() {
                            window.location.reload(true)
                        })
                    }
                } else {
                    const resp =  await axiosPost(auth, `/v1/bank_account`, newBankData)
                    if (resp.status === 201) {
                        onClose()
                        setErrorMessage(null)

                        swal({
                            title: "Berhasil!",
                            text: `Data bank berhasil ditambahkan`,
                            icon: "success",
                            timer: 1500,
                            buttons: false, 
                        }).then(function() {
                            window.location.reload(true)
                        })
                    }
                }


            } catch (err) {
                console.log(err?.response)
            } finally {
                setLoadingCreate(false)
            }
        }
    }

    const handleOnClose = (e) => {
        e.preventDefault()
       
        setNewBankData({ user_id : 0, bank_name: "", bank_number: "", name_on_bank: ""})
        onClose()
        setErrorMessage(null)

    }

    const backHome = (e) => {
        e.preventDefault()

        history.push("/")
    }

    return (
        <>
        { loading && <Loading/> }
        <NavigationBar/>

        <Box 
            maxW={'7xl'} 
            alignItems={'center'}
            margin={'auto'}
            height="100vh"
        >
            <Box
                px={4}
                pt={5}
                pb={3}
            >
                <Flex justifyContent={"space-between"}>
                <Text
                    fontWeight={'bold'}
                    fontSize={textResponsive}
                >Penarikan Saldo</Text>

                <Box
                    color={'white'}
                    bg={'#AA4A30'}
                    _hover={{
                        bg: 'yellow.500',
                    }}
                    fontSize={buttonResponsive}
                    align={'center'}
                    p={2}
                    borderRadius={'15px'}
                    onClick={backHome}
                >
                    <Text>Kembali</Text>
                </Box>
                </Flex>
            </Box>

            <Box
                ml={4}
            >
            { !!bankInfo ? (
                <>
                <Box
                    py={4}
                    pl={4}
                    pr={8}
                    bg={'#E89F71'}
                    width={'350px'}
                    borderRadius={'15px'}
                >
                    <Text
                        mb={2}
                        fontWeight={'bold'}
                    >Informasi Akun Bank</Text>
                    <Box>
                        <Flex
                            justifyContent={'space-between'}
                        >
                            <Text>Nama Bank :</Text>
                            <Text>{bankInfo?.bank_name}</Text>
                        </Flex>
                        <Flex
                            justifyContent={'space-between'}
                        >
                            <Text>Nomer Rekening :</Text>
                            <Text>{bankInfo?.bank_number}</Text>
                        </Flex>
                        <Flex
                            justifyContent={'space-between'}
                        >
                            <Text>Nama Pemilik :</Text>
                            <Text>{bankInfo?.name_on_bank}</Text>
                        </Flex>

                        <Box
                            mt={4}
                            align={'center'}
                        >
                            <Button
                                onClick={handleBankData}
                                borderRadius={'15px'}
                                bg={'#AA4A30'}
                                color={'white'}
                                _hover={{
                                    bg: 'yellow.500',
                                }}
                            >Perbarui Data Rekening</Button>
                        </Box>
                    </Box>
                </Box> 

                <Box>
                    <Box
                        pt={5}
                        pb={3}
                    >
                        <Text
                            fontWeight={'bold'}
                            fontSize={textResponsive}
                        >Ajukan Penarikan Baru</Text>
                    </Box>

                    <Flex
                        mb={3}
                    >
                        <Box>
                            <Button
                                onClick={e => {
                                    if (openedWd === "money" || openWd === false) {
                                        setOpenWd(!openWd)
                                    }

                                    setOpenedWd("money")
                                    setErrorMessage(null)
                                    setNewReqBalance({ user_id : +userDetail.id, bank_acc_id: +bankInfo.id})
                                }}
                                borderRadius={'15px'}
                                mr={{
                                    xl:4,
                                    base:2
                                }}
                                bg={'#AA4A30'}
                                color={'white'}
                                _hover={{
                                    bg: 'yellow.500',
                                }}
                                fontSize={{
                                    base: "12px",
                                    sm: "14px",
                                }}
                            >Penarikan Saldo Uang</Button>
                        </Box>

                        <Box>
                            <Button
                                onClick={e =>  { 
                                    if (openedWd === "ro" || openWd === false) {
                                        setOpenWd(!openWd)  
                                    }
                                    setOpenedWd("ro")
                                    setErrorMessage(null)
                                    setNewReqBalance({ user_id : +userDetail.id, bank_acc_id: +bankInfo.id})
                                    
                                }}
                                borderRadius={'15px'}
                                bg={'#AA4A30'}
                                color={'white'}
                                _hover={{
                                    bg: 'yellow.500',
                                }}
                                fontSize={{
                                    base: "12px",
                                    sm: "14px"
                                }}
                            >Penarikan Repeat Order</Button>
                        </Box>
                    </Flex>

                    <Collapse in={openWd} animateOpacity>
                        <Box
                            bg={'#E89F71'}
                            width={{
                                xl: '430px',
                                base: "345px"
                            }}
                            borderRadius={'15px'}
                            p={4}
                            my={2}
                        >
                            { openedWd === "money" ? (
                                <>
                                    <Box
                                        color={'red'}
                                        fontWeight={'bold'}
                                    >
                                        { errorMessage && <Text
                                            mb={2}
                                        >{errorMessage}</Text>}
                                    </Box>
                                    <FormLabel
                                        fontWeight={'bold'}
                                        fontSize={textResponsive}
                                    >
                                    Masukkan Saldo Keuangan</FormLabel>
                                    <Input 
                                        bg={'gray.50'}
                                        type={'text'}
                                        value={newReqBalance.money_balance ?? ""}
                                        onChange={e => setNewReqBalance({ user_id: +userDetail.id , bank_acc_id: +bankInfo.id, money_balance: e.target.value})}    
                                    />

                                    <Button
                                        mt={3}
                                        borderRadius={'15px'}
                                        bg={'#AA4A30'}
                                        color={'white'}
                                        _hover={{
                                            bg: 'yellow.500',
                                        }}
                                        onClick={postNewReq}
                                        width={'100px'}
                                        disabled={loadingCreate ? true : false}
                                        fontSize={{
                                            base: "14px"
                                        }}
                                    >{ loadingCreate ? <Spinner/>: "Request"}</Button>
                                </>
                            ) : openedWd === "ro" && (
                                <>
                                    <Box
                                        color={'red'}
                                        fontWeight={'bold'}
                                    >
                                        { errorMessage && <Text
                                            mb={2}
                                        >{errorMessage}</Text>}
                                    </Box>
                                    <FormLabel
                                        fontWeight={'bold'}
                                        fontSize={textResponsive}
                                    >Masukkan Saldo Repeat Order</FormLabel>
                                    <Input 
                                        bg={'gray.50'}
                                        type={'text'}
                                        value={newReqBalance.ro_balance ?? ""}
                                        onChange={e => setNewReqBalance({ user_id: +userDetail.id , bank_acc_id: +bankInfo.id, ro_balance: e.target.value})}
                                    />
                                    <Button
                                        mt={3}
                                        borderRadius={'15px'}
                                        bg={'#AA4A30'}
                                        color={'white'}
                                        _hover={{
                                            bg: 'yellow.500',
                                        }}
                                        onClick={postNewReq}
                                        width={'100px'}
                                        disabled={loadingCreate ? true : false}
                                        fontSize={{
                                            base: "14px"
                                        }}
                                    >{loadingCreate ? <Spinner/>: "Request"}</Button>
                                </>
                            )}
                            <Text
                                fontSize={{
                                    xl: '14px',
                                    base:'12px'
                                }}
                                mt={2}
                            >catatan: penarikan akan diakumulasikan dalam satu minggu</Text>
                        </Box>
                    </Collapse>
                </Box>

                <TableWithdraw wdReqHistory={wdReqHistory}/>
                </>
                ) : (
                    <>
                    <Box
                        py={4}
                        pl={4}
                        pr={8}
                        bg={'#E89F71'}
                        width={'350px'}
                        borderRadius={'15px'}
                        align={'center'}   
                    >
                        <Text
                            mb={8}
                            fontWeight={'bold'}
                        >Anda belum mengisi data rekening</Text>
                        <Button
                            onClick={handleBankData}
                            borderRadius={'15px'}
                            bg={'#AA4A30'}
                            color={'white'}
                            _hover={{
                                bg: 'yellow.500',
                            }}
                        >Isi Data Rekening</Button>
                    </Box>
                    </>
                )
            }
            </Box>
        </Box>


        <Modal isOpen={isOpen} onClose={handleOnClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Isi Informasi Rekening</ModalHeader>

                <Box
                    px={6}
                >
                    {
                        errorMessage && (
                            <Box
                                bg='pink'
                                py={2}
                                pl={2}
                                mb={2}
                            >
                                <Text>{errorMessage}</Text>
                            </Box>
                        )
                    }   

                    <FormLabel>Nama Bank</FormLabel>
                    <Input
                        onChange={e => setNewBankData({...newBankData, bank_name : e.target.value, user_id : +userDetail.id})}
                        value={newBankData.bank_name}
                    />
                    <FormLabel>Nomer Rekening</FormLabel>
                    <Input
                        onChange={e => setNewBankData({...newBankData, bank_number : e.target.value,  user_id : +userDetail.id})}
                        value={newBankData.bank_number}
                    />
                    <FormLabel>Atas Nama ( Pastikan sesuai )</FormLabel>
                    <Input
                        onChange={e => setNewBankData({...newBankData, name_on_bank : e.target.value, user_id : +userDetail.id})}
                        value={newBankData.name_on_bank}
                    />

                    <Box
                        pt={4}
                        align={'center'}
                    >
                        <Button
                            width={'120px'}
                            fontWeight={'bold'}
                            onClick={e => postNewBankData(e, !!bankInfo)}
                            disabled={loadingCreate ? true : false}
                        >
                            { loadingCreate ? <Spinner/> : "Kirim"}
                        </Button>
                    </Box>
                </Box>

                <ModalFooter>
                    <Button 
                        bg={'yellow.700'} 
                        color={'gray.50'} 
                        mr={3} 
                        onClick={handleOnClose}
                        _hover={{
                            bg: 'yellow.500',
                        }}
                        >
                        Batal
                    </Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
        </>
    )
}

export { Withdraw }