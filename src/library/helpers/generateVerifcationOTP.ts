const generateVerifcationOTP = () => {
    const min = 1000;
    const max = 9999;
    const randomOTP = Math.floor(Math.random() * (max - min + 1)) + min;
  
    const otpString = randomOTP.toString();
  
    return otpString;
  };
  
  export default generateVerifcationOTP;
  