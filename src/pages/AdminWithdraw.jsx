import { Box, Button, Flex, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import swal from "sweetalert"
import { axiosGet, axiosPatch } from "../API/axios.js"
import { Loading } from "../components/Loading.jsx"
import { NavigationBar } from "../components/Navbar.jsx"
import { formatMoney, getTotalMoney, getTotalRO } from "../helper/helper.js"

function AdminWithdraw() {    
    const auth = localStorage.getItem("access_token")

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

            setListWdReq(allWdRes?.data)
            setListWdWeek(wdInWeek?.data)
        } catch (err) {
            console.log(err.response)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getListWdReq()
    },[])

    const handleFilter = (e, tag) => {
        e.preventDefault()
        setFilterTag(tag)
    }

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
            bg={'yellow.400'}
            pl={4}
            pr={6}
            py={5}
            mx={4}
            mt={2}
            w={'370px'}
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

        <Box pt={2} pl={3}>
            <Flex>
                <Box
                    p={2}
                    mr={4}
                >
                    <Text fontWeight={'bold'}>Filter</Text>
                </Box>
                <Box>
                    <Button 
                        onClick={e => handleFilter(e, "week")}
                        bg={filterTag === 'week' ? "yellow.700" : "gray.200"}
                        color={filterTag === 'week' ? "gray.50" : "black"}
                        _hover={{
                            bg: filterTag === 'week' ? "yellow.700" :  "gray.300"
                        }}    
                    >minggu ini</Button>
                    <Button 
                        onClick={e => handleFilter(e, "all")} 
                        ml={2}
                        bg={filterTag === 'all' ? "yellow.700" : "gray.200"}
                        color={filterTag === 'all' ? "gray.50" : "black"}
                        _hover={{
                            bg: filterTag === 'all' ? "yellow.700" :  "gray.300"
                        }}    
                    >semua</Button>
                </Box>
            </Flex>

            <Table variant='simple' maxW={'7xl'}>
                <Thead>
                    <Tr>
                        <Th>No</Th>
                        <Th>Nama Lengkap</Th>
                        <Th>No Telp</Th>
                        <Th>Bank</Th>
                        <Th>No Rekening</Th>
                        <Th>Keuangan</Th>
                        <Th>RO dan Bonus Jaringan</Th>
                        <Th>Status</Th>
                        <Th>Accept</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    { filterTag === "all" ? listWdReq?.map((wd, id) => (
                        <Tr key={id}>
                            <Td>{id+ 1}</Td>
                            <Td>{wd.fullname}</Td>
                            <Td>{wd.phone_number}</Td>
                            <Td>{wd.bank_name}</Td>
                            <Td>{wd.bank_number}</Td>
                            <Td>{formatMoney(wd.money_balance)}</Td>
                            <Td>{formatMoney(wd.ro_money_balance)}</Td>
                            <Td>{wd.approved ? "Terkirim" : "Pending" }</Td>
                            <Td>
                                <Button 
                                    width={20}
                                    bg={wd.approved ? "red.500" : "blue.400"}
                                    _hover={{
                                        bg: wd.approved ? "red.300" : "blue.300"
                                    }}
                                    color="white"
                                    onClick={e => postApprove(e,id, wd.id, wd.approved)}
                                >{ loadingSend && idToLoading == id ? <Spinner/> :
                                wd.approved ? "Batal" : "Terima"}</Button>
                            </Td>
                        </Tr>
                    )) : listWdWeek?.map((wd, id) => (
                        <Tr key={id}>
                        <Td>{id+ 1}</Td>
                        <Td>{wd.fullname}</Td>
                        <Td>{wd.phone_number}</Td>
                        <Td>{wd.bank_name}</Td>
                        <Td>{wd.bank_number}</Td>
                        <Td>{formatMoney(wd.money_balance)}</Td>
                        <Td>{formatMoney(wd.ro_money_balance)}</Td>
                        <Td>{wd.approved ? "Terkirim" : "Pending" }</Td>
                        <Td>
                            <Button 
                                width={20}
                                bg={wd.approved ? "red.500" : "blue.400"}
                                _hover={{
                                    bg: wd.approved ? "red.300" : "blue.300"
                                }}
                                onClick={e => postApprove(e,id, wd.id, wd.approved)}
                                color="white"
                            >{ loadingSend && idToLoading == id ? <Spinner/> :
                            wd.approved ? "Batal" : "Terima"}</Button>
                        </Td>
                    </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
        </>
    )
}

export { AdminWithdraw }