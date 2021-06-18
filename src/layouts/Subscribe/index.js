import React from "react";
import MaskedInput from "react-input-mask";
import cardvalidator from "card-validator";
import emailvalidator from "email-validator";
import { ErrorBoundary, Loader, InputCheckbox } from "@components";
import { post, prices } from "@controllers";
import { useToast } from "@hooks";

export const Subscribe = () => {
  const stateModel = {
    duration: 12,
    amount: 5,
    upfront: false,
    number: "",
    expiry: "",
    cvc: "",
    email: "",
    accept: false,
  };

  const toast = useToast();
  const [step, setStep] = React.useState(1);
  const [cardInfo, setCardInfo] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [price_list, setPrice_list] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [errorDetails, setErrorDetails] = React.useState({});
  const [params, setParams] = React.useState(stateModel);

  const loadPrices = async () => {
    setLoading(true);
    let response = await prices();
    if (response) {
      setLoading(false);
      if (response.subscription_plans) {
        setPrice_list(response.subscription_plans);
      }
    }
  };

  const calculatePrices = () => {
    let price_usd_per_gb =
      price_list.find((item) => item.duration_months === params.duration)
        ?.price_usd_per_gb || 0;
    let total_price = price_usd_per_gb * params.amount;
    if (params.upfront) {
      total_price *= 1.1;
    }
    setTotalPrice(total_price.toFixed(2));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorDetails({});
    let error = false;
    switch (step) {
      case 1:
        setStep(2);
        break;
      case 2:
        if (!params.number) {
          setErrorDetails((prevDetails) => ({
            ...prevDetails,
            number: "Card Number is required!",
          }));
          error = true;
        } else if (!cardInfo?.isValid) {
          setErrorDetails((prevDetails) => ({
            ...prevDetails,
            number: "Card is not valid!",
          }));
          error = true;
        }

        if (!params.expiry) {
          setErrorDetails((prevDetails) => ({
            ...prevDetails,
            expiry: "Expiry date is required!",
          }));
          error = true;
        }

        if (!params.cvc) {
          setErrorDetails((prevDetails) => ({
            ...prevDetails,
            cvc: "CVC is required!",
          }));
          error = true;
        }

        if (!error) {
          setStep(3);
        }
        break;
      case 3:
        if (!params.email.replace(/[ ]/g, "")) {
          setErrorDetails((prevDetails) => ({
            ...prevDetails,
            email: "E-Mail is required!",
          }));
          error = true;
        } else if (!emailvalidator.validate(params.email)) {
          setErrorDetails((prevDetails) => ({
            ...prevDetails,
            email: "E-Mail is not valid!",
          }));
          error = true;
        }

        if (!params.accept) {
          setErrorDetails((prevDetails) => ({
            ...prevDetails,
            accept: "You must accept terms and conditions!",
          }));
          error = true;
        }

        if (!error) {
          setLoading(true);
          let response = await post(params);
          if (response) {
            setLoading(false);
            if (response.data) {
              toast.fire({
                icon: "success",
                title: "Your payment was successfull!",
              });
              setParams(stateModel);
              setStep(1);
            }
          }
        }
        break;
      default:
        break;
    }
  };

  const renderContent = () => {
    let content = null;
    switch (step) {
      case 1:
        content = (
          <React.Fragment>
            <div className="form-group">
              <label className="form-control-label">Duration</label>
              <select
                value={params.duration}
                onChange={(e) =>
                  setParams({ ...params, duration: parseInt(e.target.value) })
                }
                className="form-control"
              >
                {price_list.map((item, key) => (
                  <option
                    value={item.duration_months}
                    key={key}
                  >{`${item.duration_months} months - ${item.price_usd_per_gb}$ / GB `}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-control-label">Amount</label>
              <select
                value={params.amount}
                onChange={(e) =>
                  setParams({ ...params, amount: parseInt(e.target.value) })
                }
                className="form-control"
              >
                {[5, 10, 50].map((item, key) => (
                  <option value={item} key={key}>{`${item} GB`}</option>
                ))}
              </select>
            </div>
            <div className="form-row mx-0">
              <InputCheckbox
                label="Upfront payment"
                checked={params.upfront}
                onChange={(e) => setParams({ ...params, upfront: !e })}
              />
              <button className="btn btn-default d-flex align-items-center ml-auto">
                Next
                <i className="feather feather-arrow-right ml-2" />
              </button>
            </div>
          </React.Fragment>
        );
        break;
      case 2:
        content = (
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label className="form-control-label">Card Number</label>
                <div className="d-flex align-items-center">
                  <MaskedInput
                    value={params.number}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        number: e.target.value.replace(/[• ]/g, ""),
                      })
                    }
                    placeholder="•••• •••• •••• ••••"
                    mask="9999 9999 9999 9999"
                    className="form-control"
                    maskChar="•"
                  />
                  {cardInfo?.card && (
                    <img
                      width="50"
                      height="35"
                      className="ml-2"
                      alt={cardInfo?.card.niceType}
                      src={`/assets/images/icons/${cardInfo?.card.type}.svg`}
                    />
                  )}
                </div>
                {errorDetails.number && (
                  <label className="error-label">{errorDetails.number}</label>
                )}
              </div>
            </div>
            <div className="col-3">
              <div className="form-group">
                <label className="form-control-label">MM / YY</label>
                <MaskedInput
                  value={params.expiry}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      expiry: e.target.value.replace(/[ ]/g, ""),
                    })
                  }
                  placeholder="MM / YY"
                  className="form-control"
                  mask="99 / 99"
                />
                {errorDetails.expiry && (
                  <label className="error-label">{errorDetails.expiry}</label>
                )}
              </div>
            </div>
            <div className="col-3">
              <div className="form-group">
                <label className="form-control-label">CVC</label>
                <MaskedInput
                  value={params.cvc}
                  onChange={(e) =>
                    setParams({ ...params, cvc: e.target.value })
                  }
                  className="form-control"
                  placeholder="CVC"
                  mask="999"
                />
                {errorDetails.cvc && (
                  <label className="error-label">{errorDetails.cvc}</label>
                )}
              </div>
            </div>
            <div className="col-12 d-flex">
              <button
                type="button"
                className="btn btn-outline-default d-flex align-items-center"
                onClick={() => setStep(1)}
              >
                <i className="feather feather-arrow-left mr-2" />
                Back
              </button>
              <button className="btn btn-default d-flex align-items-center ml-auto">
                Next
                <i className="feather feather-arrow-right ml-2" />
              </button>
            </div>
          </div>
        );
        break;
      case 3:
        content = (
          <React.Fragment>
            <div className="form-group">
              <label className="form-control-label">E-Mail</label>
              <input
                type="email"
                value={params.email}
                onChange={(e) =>
                  setParams({
                    ...params,
                    email: e.target.value,
                  })
                }
                placeholder="Enter your e-mail address"
                className="form-control"
              />
              {errorDetails.email && (
                <label className="error-label">{errorDetails.email}</label>
              )}
            </div>
            <div className="form-group">
              <InputCheckbox
                label="Agree with Terms and conditions"
                checked={params.accept}
                onChange={(e) => setParams({ ...params, accept: !e })}
              />
              {errorDetails.accept && (
                <label className="error-label">{errorDetails.accept}</label>
              )}
            </div>
            <div className="form-row mx-0">
              <button
                type="button"
                className="btn btn-outline-default d-flex align-items-center"
                onClick={() => setStep(2)}
              >
                <i className="feather feather-arrow-left mr-2" />
                Back
              </button>
              <button
                disabled={!params.accept}
                className="btn btn-default ml-auto"
              >{`Submit & Pay ${totalPrice}$`}</button>
            </div>
          </React.Fragment>
        );
        break;
      default:
        content = null;
        break;
    }
    return content;
  };

  React.useEffect(() => {
    calculatePrices();
  }, [price_list, params.duration, params.amount, params.upfront]);

  React.useEffect(() => {
    setCardInfo(cardvalidator.number(params.number));
  }, [params.number]);

  React.useEffect(() => {
    loadPrices();
  }, []);

  return (
    <ErrorBoundary>
      {loading && <Loader />}
      <h3 className="text-default">{`Total price of subscription: ${totalPrice} $`}</h3>
      <form onSubmit={onSubmit}>{renderContent()}</form>
    </ErrorBoundary>
  );
};
