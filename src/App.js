import React, { useState, useEffect } from "react";
import "./App.css";
import Iframe from "./component/Iframe";
import axios from "axios";

const baseURL =
  "https://raw.githubusercontent.com/stefanbinder/countries-states/master/countries.json";

const formFeilds = [
  {
    feild: "userName",
    validator: [{ required: true }, { min: 4 }, { max: 10 }],
  },
  {
    feild: "dob",
    validator: [{ required: false }],
  },
  {
    feild: "country",
    validator: [{ required: true }],
  },
  {
    feild: "state",
    validator: [{ required: true }],
  },
  {
    feild: "email",
    validator: [{ required: true }, { regex: /\S+@\S+\.\S+/ }],
  },
  {
    feild: "contactNo",
    validator: [{ required: true }, { digit: 10 }],
  },
];

const App = () => {
  const [data, setData] = useState();
  const [userName, setUserName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [info, setInfo] = useState({
    success: false,
    successMessage: "",
    error: false,
    errorMessage: "",
  });

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setData(response.data);
    });
    window.addEventListener(
      "message",
      function (e) {
        if (
          e.origin !== window.location.origin ||
          e.data.userName === undefined
        ) {
          return;
        }
        validate(e.data);
      },
      false
    );
  }, []);
  const validate = (data) => {
    try {
      formFeilds.forEach((element) => {
        console.log("element.feild", element.feild);
        for (let i = 0; i < element.validator.length; i++) {
          if (element.validator[0].required) {
            if (data[element.feild] === undefined || data[element.feild] === "")
              throw {
                message: `{"${element.feild}": {"error": "are mandatory fields"}}`,
              };
          }
          if (data[element.feild] !== "") {
            console.log(Object.keys(element.validator[i])[0]);
            switch (Object.keys(element.validator[i])[0]) {
              case "min":
                if (data[element.feild].length < element.validator[i].min) {
                  throw {
                    message: 
                    `{"${element.feild}": {"error": "length should be between 4-10 characters."}}`,
                  };
                } else {
                  break;
                }
              case "max":
                if (data[element.feild].length > element.validator[i].max) {
                  throw {
                    message: 
                    `{"${element.feild}": {"error": "length should be between 4-10 characters."}}`,
                  };
                } else {
                  break;
                }
              case "regex":
                console.log(element.validator[i].regex);
                console.log(data[element.feild]);
                if (!element.validator[i].regex.test(data[element.feild])) {
                  throw {
                    message: `{"${element.feild}": {"error": "should only support valid email address"}}`,
                  };
                } else {
                  break;
                }
              case "digit":
                if (data[element.feild].length < element.validator[i].digit || data[element.feild].length > element.validator[i].digit) {
                  throw {
                    message: `{"${element.feild}": {"error": "mobile number should be of ${element.validator[i].digit} digits."}}`,
                  };
                } else {
                  break;
                }
              default:
                continue;
            }
          }
        }
      });
      setInfo({
        ...info,
        success: true,
        successMessage: `{"Success": "All fields are valid."}`,
        error: false,
        errorMessage: "",
      });
    } catch (error) {
      setInfo({
        ...info,
        success: false,
        successMessage: "",
        error: true,
        errorMessage: error.message,
      });
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    window.parent.postMessage(
      {
        userName,
        email,
        country,
        state,
        contactNo,
        dob,
      },
      "*"
    );
  };
  return (
    <>
      <Iframe title="iframe">
        <form onSubmit={(e) => onSubmit(e)} target="iframeForm" style={{background: "#EEEDE7", padding: "8px"}}>
          <p>Can you please provide your personal details?</p>
          <div style={{marginTop: "20px"}}>
            <label htmlFor="name" style={{fontWeight: "bold"}}>Name</label>
            <br />
            <input
              type="text"
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{borderRadius: "5px", height: "2rem", width: "100%", border: "1px solid #B9B7BD"}}
            />
          </div>
          <div style={{marginTop: "20px"}}>
            <label htmlFor="dob" style={{fontWeight: "bold"}}>Date of birth</label>
            <br />
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={{borderRadius: "5px", height: "2rem", width: "100%", border: "1px solid #B9B7BD"}}
            />
          </div>
          <div style={{marginTop: "20px"}}>
            <label htmlFor="contactNo" style={{fontWeight: "bold"}}>Contact No</label>
            <br />
            <input
              type="number"
              id="ContactNo"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              style={{borderRadius: "5px", height: "2rem", width: "100%", border: "1px solid #B9B7BD"}}
            />
          </div>
          <div style={{marginTop: "20px"}}>
            <label htmlFor="country" style={{fontWeight: "bold"}}>Country</label>
            <br />
            <select
              name="country"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{borderRadius: "5px", height: "2rem", width: "100%", border: "1px solid #B9B7BD"}}
            >
              <option value="" disabled hidden></option>
              {data?.map((coun, index) => (
                <option value={index}>{coun?.name}</option>
              ))}
            </select>
          </div>
          <div style={{marginTop: "20px"}}>
            <label htmlFor="state" style={{fontWeight: "bold"}}>State</label>
            <br />
            <select
              hidden={country?.length === 0}
              name="state"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{borderRadius: "5px", height: "2rem", width: "100%", border: "1px solid #B9B7BD"}}
            >
              <option value="" disabled hidden></option>
              {data &&
                data[country]?.states?.map((coun, index) => (
                  <option value={index}>{coun?.name}</option>
                ))}
            </select>
          </div>
          <div style={{marginTop: "20px"}}>
            <label htmlFor="email" style={{fontWeight: "bold"}}>Email</label>
            <br />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{borderRadius: "5px", height: "2rem", width: "100%", border: "1px solid #B9B7BD"}}
            />
          </div>
          <button type="submit" 
          style={{color: 'white',
          fontWeight: "bold",
          marginTop:"20px",
          height: "2rem",
          borderRadius: "5px", 
          border:0, 
          background: "#167D7F"}}
          >
            Submit
          </button>
        </form>
      </Iframe>
      <div className="message">
        {info.success && (
          <span style={{ color: "green" }}>{"Result: "} {info.successMessage}</span>
        )}
        {info.error && (
          <span style={{ color: "red" }}>{"Result: "}{info.errorMessage}</span>
        )}
      </div>
    </>
  );
};
export default App;
