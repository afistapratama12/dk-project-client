import { Box, Button, Flex, Spinner, Text} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import swal from "sweetalert"
import { axiosGet, axiosPatch } from "../API/axios.js"
import { Loading } from "../components/Loading.jsx"
import { NavigationBar } from "../components/Navbar.jsx"
import { formatMoney, getTotalMoney, getTotalRO } from "../helper/helper.js"
import { TableProps, Tbody, Td, Th, Thead, Tr } from "../uikit/TableProps.js"

import { buttonResponsive } from "../theme/font.jsx"

function AdminWithdraw() {    
    const auth = localStorage.getItem("access_token")
    const day = new Date().getDay()

    const [loading, setLoading] = useState(false)
    const [loadingSend, setLoadingSend] = useState(false)
    const [idToLoading, setIdToLoading] = useState(null)

    const [listWdReq, setListWdReq] = useState()
    const [listWdWeek, setListWdWeek] = useState()

    const [filterTag, setFilterTag] = useState("week")

    const getListWdReq = async () => {
        setLoading(true)

        try {
            const allWdRes = await axiosGet(auth, `/v1/withdraws`)
            const wdInWeek = await axiosGet(auth, `v1/withdraws/in_week`)

            setListWdReq(allWdRes?.data.sort((a, b) => new Date(a.updated_at)- new Date(b.updated_at)))
            setListWdWeek(wdInWeek?.data.sort((a, b) => new Date(a.updated_at)- new Date(b.updated_at)))
        } catch (err) {
            console.log(err.response)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getListWdReq()
    },[])

    const postApprove = async (e, idLoading, id, approved) => {
        e.preventDefault()

        setIdToLoading(idLoading)
        setLoadingSend(true)

        try {
            const resp = await axiosPatch(auth, `/v1/withdraws/${id}`, { approved : !approved})

            if (resp.status === 200) {
                swal({
                    title: "Berhasil!",
                    icon: "success",
                    timer: 1500,
                    buttons: false,
                })
            }

            getListWdReq()
        } catch (err) {
            console.log(err.response)
        } finally {
            setLoadingSend(false)
            setIdToLoading(null)
        }
    }
    
    return (
        <>
        { loading && <Loading/>}
        <NavigationBar/>

        <Box
            overflowX={'hidden'}
            maxW={'7xl'}
            margin={'auto'}
        >
        <Box
            bg={'yellow.400'}
            pl={4}
            pr={6}
            py={5}
            mx={4}
            mt={2}
            w={{
                xl:'370px',
                md: '370px',
                sm: '350px',
                base: '340px'
            }}

            fontSize={{
                xl: "18px",
                base: "14px"
            }}

            borderRadius={10}
        >
            <Text
                fontWeight={"bold"}
            >Penarikan minggu ini</Text>
            <Flex justifyContent={'space-between'} pt={1}>
                <Text>Keuangan :</Text>
                <Text>{listWdWeek ? formatMoney(getTotalMoney(listWdWeek)) : "0"}</Text>
            </Flex>
            <Flex justifyContent={'space-between'} pt={1}>
                <Text>RO dan Bonus Jaringan :</Text>
                <Text>{listWdWeek ? formatMoney(getTotalRO(listWdWeek)): "0"}</Text>
            </Flex>
        </Box>

        <Box pt={2} pl={3} mt={2}>
            <Flex>
                <Box
                    p={2}
                    mr={4}
                >
                    <Text fontWeight={'bold'}>Filter</Text>
                </Box>
                <Box>
                    <Button 
                        onClick={e => setFilterTag("week")}
                        bg={filterTag === 'week' ? "yellow.700" : "gray.200"}
                        color={filterTag === 'week' ? "gray.50" : "black"}
                        _hover={{
                            bg: filterTag === 'week' ? "yellow.700" :  "gray.300"
                        }}    
                    >minggu ini</Button>
                    <Button 
                        onClick={e => setFilterTag("all")} 
                        ml={2}
                        bg={filterTag === 'all' ? "yellow.700" : "gray.200"}
                        color={filterTag === 'all' ? "gray.50" : "black"}
                        _hover={{
                            bg: filterTag === 'all' ? "yellow.700" :  "gray.300"
                        }}    
                    >semua</Button>
                </Box>
            </Flex>

            <Box mt={2}  >
                <Text fontSize={buttonResponsive}>Note: Admin hanya dapat melakukan penerimaan atau pembatalan pada hari <strong>Minggu</strong></Text>
            </Box>

            <Box
                overflow={'auto'}
                mt={2}
            >

            <Box
                width={{
                    xl : "1300px",
                    md: "1000px",
                    sm : '700px',
                    base: '700px'}}
                display={'block'}
            >
            <TableProps>
                <Thead>
                    <Tr>
                        <Th w={'10%'}>No</Th>
                        <Th align={'left'}>Nama Lengkap</Th>
                        <Th w={{
                            xl: "200px",
                            md: "200px",
                            sm: "100px",
                            base: "100px"
                            }}>No Telp</Th>
                        <Th>Bank</Th>
                        <Th>No Rekening</Th>
                        <Th>Keuangan</Th>
                        <Th>RO dan Bonus Jaringan</Th>
                        <Th>Status</Th>
                        <Th>Accept</Th>
                    </Tr>
                </Thead>
                <Tbody
                    whiteSpace="nowrap"
                >
                { filterTag === "all" ? listWdReq?.map((wd, id) => (
                        <Tr key={id}>
                        <Td w={'10%'}>{id+ 1}</Td>
                        <Td align={'left'}>{wd.fullname}</Td>
                        <Td w={{
                                    xl: "300px",
                                    md: "300px",
                                    sm: "100px",
                                    base: "100px"}}>{wd.phone_number}</Td>
                        <Td>{wd.bank_name}</Td>
                        <Td>{wd.bank_number}</Td>
                        <Td>{formatMoney(wd.money_balance)}</Td>
                        <Td>{formatMoney(wd.ro_money_balance)}</Td>
                        <Td>{wd.approved ? "Terkirim" : "Pending" }</Td>
                        <Td>
                            <Button 
                                fontSize={{
                                    xl: "18px",
                                    md: "16px",
                                    sm: "14px",
                                    base: "12px"
                                }}
                                width={{
                                    xl: 20,
                                    md: 20,
                                    sm: 14,
                                    base: 14
                                }}
                                bg={wd.approved ? "gray.500" : "blue.400"}
                                _hover={{
                                    bg: wd.approved ? "gray.500" : "blue.300"
                                }}
                                onClick={e => postApprove(e,id, wd.id, wd.approved)}
                                color="white"
                                disabled={wd.approved || day !== 0 ? true: false}
                            >{ loadingSend && idToLoading === id ? <Spinner/> :
                            wd.approved ? "diterima" : "Terima"}</Button>
                        </Td>
                    </Tr>
                    )) : listWdWeek?.map((wd, id) => (
                        <Tr key={id}>
                        <Td w={'10%'}>{id+ 1}</Td>
                        <Td align={'left'}>{wd.fullname}</Td>
                        <Td w={{
                            xl: "300px",
                            md: "300px",
                            sm: "100px",
                            base: "100px"}}>{wd.phone_number}</Td>
                        <Td>{wd.bank_name}</Td>
                        <Td>{wd.bank_number}</Td>
                        <Td>{formatMoney(wd.money_balance)}</Td>
                        <Td>{formatMoney(wd.ro_money_balance)}</Td>
                        <Td>{wd.approved ? "Terkirim" : "Pending" }</Td>
                        <Td>
                            <Button 
                                fontSize={{
                                    xl: "18px",
                                    md: "16px",
                                    sm: "14px",
                                    base: "12px"
                                }}
                                width={{
                                    xl: 20,
                                    md: 20,
                                    sm: 14,
                                    base: 14
                                }}
                                bg={wd.approved ? "gray.500" : "blue.400"}
                                _hover={{
                                    bg: wd.approved ? "gray.500" : "blue.300"
                                }}
                                onClick={e => postApprove(e,id, wd.id, wd.approved)}
                                color="white"
                                disabled={wd.approved || day !== 0 ? true: false}
                            >{ loadingSend && idToLoading === id ? <Spinner/> :
                            wd.approved ? "Diterima" : "Terima"}</Button>
                        </Td>
                    </Tr>
                    ))}
                </Tbody>
            </TableProps>
            </Box>
        </Box>
        </Box>

        </Box>
        </>
    )
}

export { AdminWithdraw }