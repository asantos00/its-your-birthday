import 'sanitize.css';
import { Grommet, ThemeType, Text } from 'grommet';
import { SWRConfig } from 'swr';
import { Auth0Provider } from "@auth0/auth0-react";
import Header from '../components/Header';

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
  console.log(typeof window !== 'undefined' && window.location.origin)
  return (
    <Grommet theme={theme} themeMode="light">
      <Auth0Provider
        domain="its-your-birthday.eu.auth0.com"
        clientId="L8rqEyLpnmtgSpY2Mv4ncWyX3Fuh1XQa"
        redirectUri={typeof window !== 'undefined' && window.location.origin}
      >
        <SWRConfig value={{
          fetcher: (url, options) => fetch(url, options).then(async (r) => {
            if (r.status >= 400) {
              throw await r.json();
            }

            return r.json();
          })
        }}>
          <Header />
          <Component {...pageProps} />
        </SWRConfig>
      </Auth0Provider>
    </Grommet >
  )
}

export default App;
