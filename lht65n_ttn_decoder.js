function decodeUplink(input) {
  let external = false; // set to true if external temp. sensor connected
  var extTemp = 0;
  // ------------- BATTERY ---------------
  let batBytes = input.bytes[0] << 8 | input.bytes[1];
  let batStateValue = batBytes >> 14; // get first 2 bits of 2 battery bytes
  var batStateMsg = "";
  switch(batStateValue) {
    case 0:
      batStateMsg = "Ultra Low";
      break;
    case 1:
      batStateMsg = "Low";
      break;
    case 2:
      batStateMsg = "OK";
      break;
    case 3:
      batStateMsg = "Good";
      break;
} 
  let batV = (batBytes & 0x3FFF)/ 1000; // get last 14 bit of 2 bytes
  
  // ------------- INTERNAL TEMP ---------------
  let intTempBytes = input.bytes[2] << 8 | input.bytes[3];
  let intNegFlag = (intTempBytes>>15)*(-65536);
  let intTemp=(intNegFlag+(intTempBytes)) / 100;

  // ------------- INTERNAL HUMIDITY ---------------

  let intHumBytes = input.bytes[4] << 8 | input.bytes[5];
  let intHum = intHumBytes / 10;
  
  // ------------- EXTERNAL TEMP. ---------------
  
  if(external){
    let extSensorByte = input.bytes[6];
    let extTempBytes = input.bytes[7] << 8 | input.bytes[8];
    if (extSensorByte == 1 && external){
      let extNegFlag = (extTempBytes>>15)*(-65536);
      extTemp=(extNegFlag+(extTempBytes)) / 100;
    }
  }
  
  // ------------- OUTPUT ---------------
  
  if(!external){
    return {
      data: {
        batState: batStateMsg,
        batV_V: batV,
        intTemp_C: intTemp,
        intHum_pct: intHum,
      }
    };
  }
  
  else{
    return {
      data: {
        batState: batStateMsg,
        batV_V: batV,
        intTemp_C: intTemp,
        intHum_pct: intHum,
        extTemp_C: extTemp
      }
    };
  }
  }
