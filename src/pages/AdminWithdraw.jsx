import { Box, Button, Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import swal from "sweetalert"
import { axiosGet, axiosPatch } from "../API/axios.js"
import { Loading } from "../components/Loading.jsx"
import { NavigationBar } from "../components/Navbar.jsx"
import { formatMoney } from "../helper/helper.js"

function AdminWithdraw() {    
    const auth = localStorage.getItem("access_token")

    const [loading, setLoading] = useState(false)

    const [listWdReq, setListWdReq] = useState()
    const [listWdWeek, setListWdWeek] = useState()

    const [totalMoney, setTotalMoney] = useState(0)
    const [totalRoMoney, setTotalRoMoney] = useState(0)

    const [filterTag, setFilterTag] = useState("all")

    const getListWdReq = async () => {
        setLoading(true)

        try {
            const allWdRes = await axiosGet(auth, `/v1/withdraws`)
            const wdInWeek = await axiosGet(auth, `v1/withdraws/in_week`)

            let money = 0
            let roMoney = 0

            wdInWeek?.data?.map((wd) => {
                roMoney += wd.ro_money_balance
                money += wd.money_balance
            })

            setTotalMoney(money)
            setTotalRoMoney(roMoney)

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

    const postApprove = async (e, id, approved) => {
        e.preventDefault()

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
            setLoading(false)
        }
    }

    console.log(listWdReq)
    
    return (
        <>

        { loading && <Loading/>}

        <NavigationBar/>

        <Box>
            <Text>Penarikan minggu ini :</Text>
            <Flex>
                <Text>Keuangan :</Text>
                <Text>{formatMoney(totalMoney)}</Text>
            </Flex>
            <Flex>
                <Text>RO dan Bonus Jaringan :</Text>
                <Text>{formatMoney(totalRoMoney)}</Text>
            </Flex>
        </Box>

        <Box>
            <Flex>
                <Box
                    p={2}
                    mr={4}
                >
                    <Text fontWeight={'bold'}>Filter</Text>
                </Box>
                <Box>
                    <Button onClick={e => handleFilter(e, "all")}>semua</Button>
                    <Button onClick={e => handleFilter(e, "week")} ml={2}>minggu ini</Button>
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
                                    onClick={e => postApprove(e, wd.id, wd.approved)}
                                >{wd.approved ? "Batal" : "Terima"}</Button>
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
                                onClick={e => postApprove(e, wd.id, wd.approved)}
                                color="white"
                            >{wd.approved ? "Batal" : "Terima"}</Button>
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