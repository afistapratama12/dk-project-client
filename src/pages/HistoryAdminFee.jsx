import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { axiosGet } from '../API/axios.js';
import { Loading } from '../components/Loading.jsx';

import { NavigationBar } from '../components/Navbar.jsx';

import { buttonResponsive, textResponsive } from '../theme/font.jsx';

import { formatMoney, getTotalMoney } from '../helper/helper.js';
import { TableProps, Tbody, Td, Th, Thead, Tr } from '../uikit/TableProps.js';
import moment from 'moment-timezone';

function HistoryAdminFee() {
  const auth = localStorage.getItem('access_token');

  const [loading, setLoading] = useState();
  const [isNullData, setIsNullData] = useState(false)

  const [feeTrans, setFeeTrans] = useState();
  const [filter, setFilter] = useState('month');

  const getFeeTrans = async () => {
    setLoading(true);

    try {
      const resp = await axiosGet(auth, `/v1/transaction/admin/transaction`);

      if (resp.data === null) {
        setIsNullData(true)
        setFeeTrans([]);
      }
      setFeeTrans(resp.data);
    } catch (err) {
      console.log(err.response);
    } finally {
      setLoading(false);
    }
  }

  console.log(feeTrans)

  useEffect(() => {
    getFeeTrans();
  }, []);

  return (
    <>
      {loading && <Loading />}

      <NavigationBar />

      <Box maxW={'7xl'} margin={'auto'}>
        <Box px={6} pt={1}>
          <Text fontWeight={'bold'} fontSize={textResponsive}>
            Akumulasi Biaya Admin
          </Text>

          <Box
            mt={2}
            ml={-2}
            borderRadius={'15px'}
            bg={'yellow.400'}
            w={'300px'}
            py={2}
            px={4}
          >
            <Flex py={1} justifyContent={'space-between'}>
              <Text>Bulan ini :</Text>
              <Text>
                {isNullData ? 0 : feeTrans &&
                  formatMoney(
                    getTotalMoney(
                      feeTrans?.filter(
                        t => moment(t.created_at).month() === moment().month() && t.category === "admin_fee"
                      )
                    )
                  )}
              </Text>
            </Flex>
            <Flex pb={1} justifyContent={'space-between'}>
              <Text>Total :</Text>
              <Text>{isNullData ? 0 : feeTrans && formatMoney(getTotalMoney(feeTrans?.filter(t => t.category === "admin_fee")))}</Text>
            </Flex>
          </Box>
        </Box>

        <Box mt={4} px={3}>
          <Flex mb={2}>
            <Box p={2} mr={4}>
              <Text fontWeight={'bold'}>Filter</Text>
            </Box>
            <Box>
              <Button
                onClick={e => setFilter('month')}
                bg={filter === 'month' ? '#AA4A30' : 'gray.200'}
                color={filter === 'month' ? 'gray.50' : 'black'}
                _hover={{
                  bg: filter === 'month' ? '#AA4A30' : 'gray.300',
                }}
                fontSize={buttonResponsive}
              >
                Bulan ini
              </Button>
              <Button
                onClick={e => setFilter('all')}
                ml={2}
                bg={filter === 'all' ? '#AA4A30' : 'gray.200'}
                color={filter === 'all' ? 'gray.50' : 'black'}
                _hover={{
                  bg: filter === 'all' ? '#AA4A30' : 'gray.300',
                }}
                fontSize={buttonResponsive}
              >
                Semua
              </Button>
            </Box>
          </Flex>


          <TableProps>
            <Thead>
              <Tr>
                <Th>No</Th>
                <Th>Tanggal</Th>
                <Th>Deskripsi</Th>
                <Th>Nama</Th>
                <Th>Total</Th>
              </Tr>
            </Thead>

            <Tbody>
              {filter === 'month'
                ? feeTrans
                    ?.filter(t => moment(t.created_at).month === moment().month && t.to_id === 1 && t.money_balance !== 0 && t.from_id !== 1) 
                    .map((t, id) => (
                      <Tr key={id}>
                        <Td>{id + 1}</Td>
                        <Td>{t.created_at}</Td>
                        <Td>{t.description}</Td>
                        <Td>{t.from_fullname}</Td>
                        <Td>{formatMoney(t.money_balance)}</Td>
                      </Tr>
                    ))
                : feeTrans?.filter(t => t.to_id === 1 && t.money_balance !== 0 && t.from_id !== 1).map((t, id) => (
                    <Tr key={id}>
                      <Td>{id + 1}</Td>
                      <Td>{t.created_at}</Td>
                      <Td>{t.description}</Td>
                      <Td>{t.from_fullname}</Td>
                      <Td>{formatMoney(t.money_balance)}</Td>
                    </Tr>
                  ))}
            </Tbody>
          </TableProps>
            {
              isNullData && (
                <Box
                top="calc(50% - (58px / 2))" 
                right="calc(50% - (100px / 2))"
                position="fixed"
                display={'block'}
                >
                <Text
                    fontWeight={'bold'}
                    fontSize={textResponsive}
                >Data Kosong</Text>
                </Box>
              )
            }
        </Box>
      </Box>
    </>
  );
}

export { HistoryAdminFee };
