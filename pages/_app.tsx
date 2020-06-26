import 'sanitize.css';
import { Grommet, ThemeType, Header, Text } from 'grommet';
import Head from 'next/head';
import Link from 'next/link';
import { SWRConfig } from 'swr';

const theme: ThemeType = {
  global: {
    font: {
      family: 'Quicksand',
      size: '14px',
      height: '20px',
    },
    focus: {
      border: {
        color: ""
      }
    },
    active: {
      background: {
        color: "pink",
      }
    },
    colors: {
      brand: "#f85f6a",
      focus: "accent-1",
      "accent-1": "#5f6af8",
      "dark-5": "#d2dae2",
      placeholder: "#c0c0c0",
    },
    control: {
      border: {
        width: "2px",
        radius: "6px"
      },
    },
    input: {
      weight: "normal",
      font: {
        weight: 'normal',
        size: "medium"
      },
    },
    elevation: {
      light: {
        //@ts-ignore
        reverse: "0px 0px 8px rgba(0,0,0,0.40)"
      }
    }
  },
  text: {
    xsmall: {
      size: "12px",
    },
    small: {
      size: "14px",
    },
    medium: {
      size: "17px",
    },
  },
  checkBox: {
    border: {
      color: {
        light: "dark-5",
      }
    },
    hover: {
      border: {
        color: {
          light: "accent-1",
        }
      }
    },
  },
  formField: {
    label: {
      size: "small",
      color: "brand"
    },
  },
  button: {
    size: {
      medium: {
        border: {
          radius: "6px"
        },
        pad: {
          vertical: "8px"
        }
      }
    },
    default: {
      background: "brand",
      color: "white",
      border: {
        color: "none"
      }
    },
  },
};

function App({ Component, pageProps }) {
  return (
    <Grommet theme={theme} themeMode="light">
      <Header background="brand" pad="large" elevation="small">
        <Link href="/">
          <a style={{ textDecoration: 'none' }}>
            <Text color="white" weight="bold">it's your birthday</Text>
          </a>
        </Link>
      </Header>
      <SWRConfig value={{
        fetcher: (url, options) => fetch(url, options).then(r => r.json())
      }}>
        <Component {...pageProps} />
      </SWRConfig>
    </Grommet>
  )
}

export default App;
