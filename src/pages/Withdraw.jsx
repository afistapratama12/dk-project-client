import { Box, Button, Flex, FormLabel, Heading, Input, Radio, RadioGroup, Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { axiosGet } from "../API/axios"
import { NavigationBar } from "../components/Navbar.jsx"
import { formatMoney } from "../helper/helper"


export function TableWithdraw({ wdReqHistory }) {
    return(
        <Box>
            <Text fontWeight={'bold'}>Rowayat Penarikan Anda</Text>

            <Table variant={'simple'}>
                <Thead>
                    <Tr>
                        <Th>No</Th>
                        <Th >Penarikan Uang</Th>
                        <Th>Penarikan Repeat Order</Th>
                        <Th >Bonus RO dan Jaringan</Th>
                        <Th textAlign="center">Status</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        wdReqHistory?.map((wdReq, id) => (
                            <Tr key={id}>
                                <Td>{id +1}</Td>
                                <Td>{formatMoney(wdReq.money_balance)}</Td>
                                <Td>{formatMoney(wdReq.ro_balance)}</Td>
                                <Td>{formatMoney(wdReq.ro_money_balance)}</Td>
                                <Td
                                    textAlign={'center'}
                                >
                                    <Box
                                        borderRadius={15}
                                        bg='pink'
                                        ml={4}
                                        pt={2}
                                        pb={2}
                                        align="center"
                                        maxW={'80%'}
                                    >
                                        <Text 
                                            fontWeight={'bold'}>{ wdReq.approved ? "Terkirim" : "Pending"}</Text>
                                    </Box>
                                </Td>
                            </Tr>
                        ))
                    }
                </Tbody>
            </Table>
        </Box>
    )
}


function Withdraw() {
    const auth = localStorage.getItem("access_token")

    const [userDetail, setUserDetail] = useState();
    const [bankInfo, setBankInfo ] = useState()
    const [wdReqHistory, setWqReqHistory] = useState()

    const [newReqBalance, setNewReqBalance] = useState()

    const [openWdForm, setOpenWdForm] = useState()


    const getBankAccInfo = async () => {
        try {
            const respUser = await axiosGet(auth, `/v1/users/self`)

            setUserDetail(respUser.data)

            const respBankInfo = await axiosGet(auth, `/v1/bank_account`)

            if (respBankInfo?.data?.Id !== 0 && respBankInfo?.data?.user_id !== 0) {
                setBankInfo(respBankInfo?.data)
            }

            const respWR = await axiosGet(auth, `/v1/withdraws/${localStorage.getItem("id")}`)
            setWqReqHistory(respWR?.data)

        } catch (err) {
            console.log(err.response)
        }
    }

    
    console.log(openWdForm)
    console.log(wdReqHistory)


    useEffect(() => {
        getBankAccInfo()
    },[])

    return (
        <Box 
            maxW={'7xl'} 
            alignItems={'center'}
        >

            <NavigationBar/>

            <Heading>Penarikan Saldo</Heading>

            <Box>
            { !!bankInfo ? (
                <>
                <Text>Informasi Akun Bank</Text>

                <Box>
                    <Flex>
                        <Text>Nama Bank: </Text>
                        <Text>{bankInfo?.bank_name}</Text>
                    </Flex>
                    <Flex>
                        <Text>Nomer Rekening: </Text>
                        <Text>{bankInfo?.bank_number}</Text>
                    </Flex>
                    <Flex>
                        <Text>Nama Pemilik: </Text>
                        <Text>{bankInfo?.name_on_bank}</Text>
                    </Flex>
                    <Button>Perbarui data</Button>
                </Box>

                </> ) : (
                    <>
                    <Text>Anda belum mengisi data rekening untuk penarikan</Text>
                    <Button>Isi Data Rekening</Button>
                    </>
                )
            }
            </Box>

            <Box>
                <Text fontWeight={'bold'}>Penarikan Baru</Text>

                <RadioGroup onChange={setOpenWdForm} value={openWdForm}>
                    <Stack spacing={4} direction={'row'}>
                        <Radio value="money">Penarikan Saldo Uang</Radio>
                        <Radio value="ro" >Penarikan Repeat Order</Radio>
                    </Stack>
                </RadioGroup>

            { !!openWdForm && openWdForm === "money" && (
                <Box>
                    <FormLabel>Masukkan Saldo Keuangan</FormLabel>
                    <Input type={'text'}/>

                    <Button>Request</Button>
                </Box>)
            }
            { !!openWdForm && openWdForm === "ro" && (
                <Box>
                    <FormLabel>Masukkan Saldo Repeat Order</FormLabel>
                    <Input type={'text'}/>

                    <Button>Request</Button>
                </Box>
                
                )
            }
            </Box>

            {wdReqHistory && <TableWithdraw wdReqHistory={wdReqHistory}/>} 
        </Box>
    )
}

export { Withdraw }