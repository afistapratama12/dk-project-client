import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Image,
} from '@chakra-ui/react';

import { Link as ReactLink} from "react-router-dom"

import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { Spinner } from '@chakra-ui/spinner';

import { useState } from 'react';

export function NavigationBar() {
  const role = localStorage.getItem("role")

  const { isOpen, onToggle } = useDisclosure();

  const [isLoading, setIsLoading] = useState();

  const handleLogout = e => {
    e.preventDefault();
    setIsLoading(true);

    localStorage.clear();

    setIsLoading(false);
    window.location.href = '/login';
  };

  return (
    <Box
      bg={useColorModeValue('#E89F71', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
    >
      <Box 
        maxW={'7xl'}
        margin='auto'
        >
        <Flex
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align={'center'}
        >
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            
            <Link
              as={ReactLink}
              to={"/"}
            >
              <Image
                  alt="logonav"
                  src='https://ik.imagekit.io/po7ijtlbpcza/dk_logo_mini__1__eXntirBRg.png?ik-sdk-version=javascript-1.4.3&updatedAt=1647778825095'
                  objectFit="cover"
                  maxW={'50px'}
              />
            </Link> 

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav role={role}/>
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
          >
            <Button
              as={'a'}
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              bg={'#AA4A30'}
              _hover={{
                bg: 'yellow.500',
              }}
              onClick={handleLogout}
              cursor="pointer"
            >
              {isLoading ? <Spinner /> : 'Keluar'}
            </Button>
          </Stack>
        </Flex>
        <Collapse in={isOpen} animateOpacity>
          <MobileNav role={role}/>
        </Collapse>
      </Box>
    </Box>
  );
}

const DesktopNav = ({role}) => {
  // const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {role === "user" ? NAV_ITEMS.map(navItem => (
        <Box key={navItem.label} pt={2}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                as={ReactLink}
                to={navItem.href ?? '#'}
                fontSize={'md'}
                fontWeight={'bold'}
                color={'gray.800'}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map(child => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      )) : (
        NAV_ADMIN_ITEMS.map(navItem => (
          <Box key={navItem.label} pt={2}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Link
                  as={ReactLink}
                  to={navItem.href ?? '#'}
                  fontSize={'md'}
                  fontWeight={'bold'}
                  color={'gray.700'}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor,
                  }}
                >
                  {navItem.label}
                </Link>
              </PopoverTrigger>
  
              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={'xl'}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}
                >
                  <Stack>
                    {navItem.children.map(child => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        ))
      )
    }
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = ({ role }) => {
  return (
    <Stack
      bg={useColorModeValue('#E89F71', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {role === "user" ? NAV_ITEMS.map(navItem => (
        <MobileNavItem key={navItem.label} {...navItem} />
      )) : (
        NAV_ADMIN_ITEMS.map(navItem => (
          <MobileNavItem key={navItem.label} {...navItem} />
        )
      ))
    }
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={'gray.800'}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map(child => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: 'Penarikan',
    href: '/withdraw',
  },
  {
    label : "Kirim Saldo",
    href :"/user-send-balance"
  }
];

const NAV_ADMIN_ITEMS = [
  {
    label: "Saldo",
    href: "/stock-product"
  },
  {
    label: "Transaksi",
    href: "/transaction"
  },
  {
    label: "Penarikan",
    href: "/admin-withdraw"
  },
  {
    label: "Kirim Saldo",
    href: "/send-balance"
  },
]
