function decodeUplink(input) {
  var data = {};
  let external = false; // set to true if external temp. sensor connected
  
  // ------------- BATTERY ---------------
  let batBytes = input.bytes[0] << 8 | input.bytes[1];
  let batStateValue = batBytes >> 14; // get first 2 bits of 2 battery bytes
  var batStateMsg = "";
  switch(batStateValue) {
    case 0:
      data.batState = "Ultra Low";
      break;
    case 1:
      data.batState = "Low";
      break;
    case 2:
      data.batState = "OK";
      break;
    case 3:
      data.batState = "Good";
      break;
} 
  data.batVoltage_V = (batBytes & 0x3FFF)/ 1000; // get last 14 bit of 2 bytes
  
  // ------------- INTERNAL TEMP ---------------
  let intTempBytes = input.bytes[2] << 8 | input.bytes[3];
  let intNegFlag = (intTempBytes>>15)*(-65536);
  data.intTemp_C=(intNegFlag+(intTempBytes)) / 100;

  // ------------- INTERNAL HUMIDITY ---------------

  let intHumBytes = input.bytes[4] << 8 | input.bytes[5];
  data.intHum_pct = intHumBytes / 10;
  
  // ------------- EXTERNAL TEMP. ---------------
  
  let extSensorByte = input.bytes[6];
  let extTempBytes = input.bytes[7] << 8 | input.bytes[8];
  if (extSensorByte == 1 && external){
  let extNegFlag = (extTempBytes>>15)*(-65536);
  data.extTemp=(extNegFlag+(extTempBytes)) / 100;
  }
  
  // ------------- OUTPUT ---------------
  return {
    data: {
      data
    }
  };
}
