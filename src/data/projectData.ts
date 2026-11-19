export interface HardwareModule {
  id: string;
  name: string;
  model: string;
  role: string;
  pins: { from: string; to: string; signal: string }[];
  notes: string;
}

export interface BomItem {
  item: string;
  specification: string;
  qty: number;
  purpose: string;
  approxCostUsd: string;
}

export interface TeamMember {
  id: string;
  tag: string;
  name: string;
  rollNo: string;
  classSection: string;
  role: string;
  photo: string;
  photoPosition?: string;
}

export interface TeamDetailsData {
  collegeName: string;
  department: string;
  academicYear: string;
  guideName: string;
  location: string;
  contactEmail: string;
  members: TeamMember[];
}

export const PROJECT_TITLE =
  'AUTOMATIC PLANT WATERING SYSTEM USING ARDUINO UNO AND SENSORS';

export const HERO_SPECS = [
  { label: 'Microcontroller', value: 'Arduino Uno R3 (ATmega328P)' },
  { label: 'Primary Sensor', value: 'Capacitive Soil Probe (A0)' },
  { label: 'Actuator Stage', value: '5V Opto Relay + DC Pump' },
  { label: 'Control Strategy', value: 'Closed-Loop Hysteresis' },
];

export const PROJECT_ABSTRACT =
  'An automatic plant watering system uses sensors to detect soil moisture and a microcontroller to control a pump, automating irrigation by activating the pump when the soil is dry and shutting it off when it is sufficiently moist. The system’s core is a feedback loop: the soil moisture sensor provides real-time data to the microcontroller (Arduino Uno), which then executes pre-programmed logic to manage the pump via a relay. This reduces human intervention, saves time, conserves water, and ensures plants receive water when needed.';

export const PROJECT_INTRODUCTION =
  'An automatic plant watering system is a technology designed to provide plants with the correct amount of water without human intervention, making it a convenient and sustainable solution for maintaining healthy growth in both homes and agriculture. Its core function is to automate the process of irrigation by using sensors to monitor soil moisture levels and activating a pump to deliver water only when needed, preventing both underwatering and overwatering.';

export const HARDWARE_USED_DETAILS = [
  {
    name: 'Soil Moisture Sensor',
    description:
      'Measures the volumetric content of water in the soil by assessing a physical property such as electrical resistance or dielectric constant. Probes make contact with the soil, and detected changes in soil properties are translated into an analog signal indicating moisture levels to optimize irrigation, reduce water waste, and improve plant health.',
  },
  {
    name: 'Arduino Uno',
    description:
      'Acts as the central programmable "brain" of the embedded system, reading real-time sensor voltage values and executing control logic to drive actuators such as relays, DC pumps, and status indicators.',
  },
  {
    name: 'Relay Module',
    description:
      'Uses a low-power control signal from the Arduino to safely switch high-current pump circuits on or off. Provides electrical isolation between the low-voltage control system and the motor load, preventing damage to delicate microcontroller components.',
  },
  {
    name: 'DC Motor & Water Pump',
    description:
      'A DC motor converts direct current electrical energy into mechanical rotation via electromagnetic interaction between a stationary stator magnetic field and a rotating armature rotor, driving the submersible pump to deliver water from the reservoir to the soil.',
  },
];

export const PROJECT_WORKING_TEXT =
  'An automatic plant watering system works by using a microcontroller (Arduino Uno) to monitor soil moisture and activate a water pump when the soil is too dry. A soil moisture sensor is placed in the soil and provides an electrical signal to the microcontroller based on the moisture level; the system then turns the pump on and off via a relay to water the plants until the desired moisture is reached. This process automates irrigation, preventing plants from becoming over- or under-watered.';

export const CORE_COMPONENTS_SUMMARY = [
  {
    title: 'Microcontroller (Arduino Uno)',
    detail:
      'Acts as the central brain to process sensor data and control the pump.',
  },
  {
    title: 'Soil Moisture Sensor',
    detail: 'Measures the volumetric water content in the soil.',
  },
  {
    title: 'Relay Module',
    detail:
      'Acts as an electrically operated switch to safely turn the high-current water pump on and off using low-voltage signals from the microcontroller.',
  },
  {
    title: 'Submersible Water Pump',
    detail:
      'Delivers water from a reservoir to the plant’s soil when activated.',
  },
  {
    title: 'Power Supply / Battery',
    detail:
      'Provides the required regulated electrical power to the Arduino logic and DC pump circuit.',
  },
];

export const PROJECT_OBJECTIVES = [
  'Eliminate manual daily watering errors in home gardens, college nurseries, and small-scale greenhouses.',
  'Maintain consistent soil moisture inside a calibrated hysteresis band (35%–65%) to prevent relay chattering and over-irrigation.',
  'Provide real-time visual monitoring of moisture percentage and pump activity using a 16x2 I2C LCD display.',
  'Ensure safe electrical separation between low-voltage microcontroller logic and the DC water pump using an opto-isolated relay.',
];

export const WORKING_STAGES = [
  {
    step: '01. Soil Moisture Sensing',
    summary:
      'The sensor probe inserted near the plant roots measures volumetric moisture changes and generates a continuous analog voltage proportional to soil dryness.',
  },
  {
    step: '02. Signal Conditioning & Sampling',
    summary:
      'Pin A0 on the Arduino Uno reads the analog voltage via its 10-bit ADC (0–1023) and averages multiple samples to suppress noise from soil ions.',
  },
  {
    step: '03. Threshold & Hysteresis Decision',
    summary:
      'When calibrated moisture falls below 35%, the controller triggers pin D7 to energize the relay; irrigation continues smoothly until moisture reaches 65%.',
  },
  {
    step: '04. Automated Pump Irrigation',
    summary:
      'The relay closes the 5V submersible pump circuit, delivering water through silicone tubing to the sapling pot while updating the 16x2 LCD readout.',
  },
];

export const ADVANTAGES_LIST = [
  'Reduces water wastage by up to 40% compared to timed or manual watering schedules.',
  'Low-cost, modular hardware architecture easy to assemble and calibrate for any potted sapling.',
  'Corrosion-resistant capacitive sensing supports long-term deployment in damp potting soil.',
  'Operates autonomously during travel or weekends without human supervision.',
];

export const APPLICATIONS_LIST = [
  'Campus nurseries, botanical gardens, and medicinal sapling cultivation.',
  'Indoor houseplants, balcony planters, and terrace kitchen gardens.',
  'Controlled-environment polyhouses and agricultural research plots.',
  'Landscape drip irrigation zones requiring soil-feedback automation.',
];

export const FIELD_PHOTOS = [
  {
    src: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.07.16_AM_555528bf.jpeg',
    title: 'Sapling Collection & Field Soil Assessment',
    caption:
      'Selecting healthy nursery saplings for moisture threshold calibration and irrigation testing in Nellore, Andhra Pradesh.',
    meta: 'Nellore, Andhra Pradesh · Oct 18, 2026',
  },
  {
    src: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.07.17_AM_337e02d9.jpeg',
    title: 'Project Team Field Activity at Nursery',
    caption:
      'Four-member student team preparing potted plant samples for automated soil moisture sensing and drip pump trials.',
    meta: 'Stonehouse Pet, Nellore · Oct 18, 2026',
  },
];

export const TEAM_PHOTO_OPTIONS = [
  {
    label: 'Devarakonda Vaishnavi (Portrait)',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.38.03_AM_22c89439.jpeg',
  },
  {
    label: 'Jana Poojitha (Portrait)',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.31.08_AM_e561d50a.jpeg',
  },
  {
    label: 'Jana Amrutha (Portrait)',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.30.20_AM_49974fcb.jpeg',
  },
  {
    label: 'Ch Unice Preethi (Portrait)',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.31.14_AM_f275cf7c.jpeg',
  },
  {
    label: 'Vaishnavi Nursery Photo',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.07.16_AM_555528bf.jpeg',
  },
  {
    label: 'Team Nursery Group Photo',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.07.17_AM_337e02d9.jpeg',
  },
];

export const DEFAULT_TEAM_DETAILS: TeamDetailsData = {
  collegeName: 'Sree Venkateswara College of Engineering',
  department: 'Department of AI & ML (AIML) · 3rd Year, A Section',
  academicYear: '2026 – 2027',
  guideName: 'Project Supervisor / Faculty Guide',
  location: 'Nellore, Andhra Pradesh 524002, India',
  contactEmail: 'vaishnavidevarakonda244@gmail.com',
  members: [
    {
      id: 'm1',
      tag: 'T1',
      name: 'Devarakonda Vaishnavi',
      rollNo: '24JNA33026',
      classSection: '3rd Year · AIML - A Section',
      role: 'Team Lead · Hardware Integration & Sensor Calibration',
      photo:
        '/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.38.03_AM_22c89439.jpeg',
      photoPosition: 'object-top',
    },
    {
      id: 'm2',
      tag: 'T2',
      name: 'Jana Poojitha',
      rollNo: '24JNA33056',
      classSection: '3rd Year · AIML - A Section',
      role: '2nd Member · Circuit Assembly & Relay Driver Testing',
      photo:
        '/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.31.08_AM_e561d50a.jpeg',
      photoPosition: 'object-top',
    },
    {
      id: 'm3',
      tag: 'T3',
      name: 'Jana Amrutha',
      rollNo: '24JNA33056',
      classSection: '3rd Year · AIML - A Section',
      role: '3rd Member · Nursery Sapling Trials & Documentation',
      photo:
        '/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.30.20_AM_49974fcb.jpeg',
      photoPosition: 'object-top',
    },
    {
      id: 'm4',
      tag: 'T4',
      name: 'Ch Unice Preethi',
      rollNo: '—',
      classSection: '3rd Year · AIML - A Section',
      role: '4th Member · System Validation & Project Presentation',
      photo:
        '/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.31.14_AM_f275cf7c.jpeg',
      photoPosition: 'object-[center_30%]',
    },
  ],
};

export const HARDWARE_MODULES: HardwareModule[] = [
  {
    id: 'arduino',
    name: 'Arduino Uno R3',
    model: 'ATmega328P · 5V Logic · 16 MHz',
    role: 'Central microcontroller sampling analog soil moisture values, applying moving-average noise filtering, and switching the relay via digital I/O.',
    pins: [
      { from: '5V Pin', to: 'Breadboard +5V Rail', signal: 'Regulated Supply' },
      { from: 'GND Pin', to: 'Common Ground Rail', signal: '0V Reference' },
      { from: 'Pin A0', to: 'Moisture Sensor AO', signal: '10-bit ADC Input' },
      { from: 'Pin D7', to: 'Relay Module IN', signal: 'Active-Low Control' },
    ],
    notes: 'Operates smoothly from a 5V USB adapter or 9V DC barrel jack supply.',
  },
  {
    id: 'sensor',
    name: 'Soil Moisture Sensor',
    model: 'Capacitive v1.2 (Corrosion-Resistant)',
    role: 'Measures dielectric permittivity of surrounding soil and outputs a proportional analog voltage between ~1.2V (wet) and ~3.0V (dry).',
    pins: [
      { from: 'VCC', to: 'Arduino 5V', signal: 'Power Supply' },
      { from: 'GND', to: 'Arduino GND', signal: 'Ground' },
      { from: 'AOUT', to: 'Arduino A0', signal: 'Analog Voltage (0–1023)' },
    ],
    notes: 'Capacitive sensing avoids copper electrode electrolysis, extending probe lifespan beyond 12 months in damp potting soil.',
  },
  {
    id: 'relay',
    name: '5V Single-Channel Relay',
    model: 'SRD-05VDC-SL-C with Optocoupler',
    role: 'Electrically isolates the Arduino 5V logic pin from inductive motor kickback while switching the water pump power loop.',
    pins: [
      { from: 'VCC', to: 'Arduino 5V', signal: 'Coil Power' },
      { from: 'GND', to: 'Arduino GND', signal: 'Ground' },
      { from: 'IN', to: 'Arduino D7', signal: 'Control Trigger' },
      { from: 'COM / NO', to: 'Pump +5V / External Supply', signal: 'Switched Load' },
    ],
    notes: 'Includes a flyback diode on the coil and status LED indicating active pump switching.',
  },
  {
    id: 'pump',
    name: 'Submersible Mini Water Pump',
    model: '3V–6V DC Brushless · 80–120 L/h',
    role: 'Draws water from the reservoir bottle through 6 mm silicone tubing directly to the plant root zone whenever the relay closes.',
    pins: [
      { from: 'Red (+)', to: 'Relay NO Terminal', signal: 'Switched +5V' },
      { from: 'Black (-)', to: 'External Supply GND', signal: 'Return Path' },
    ],
    notes: 'Powered via a dedicated 5V/1A supply through the relay contact to prevent microcontroller brownouts.',
  },
  {
    id: 'lcd',
    name: '16x2 Character LCD (I2C)',
    model: 'HD44780 + PCF8574 Backpack',
    role: 'Displays real-time moisture percentage, soil condition status, and active pump state without requiring a serial monitor.',
    pins: [
      { from: 'VCC', to: 'Arduino 5V', signal: 'Display Power' },
      { from: 'GND', to: 'Arduino GND', signal: 'Ground' },
      { from: 'SDA', to: 'Arduino A4', signal: 'I2C Data Line' },
      { from: 'SCL', to: 'Arduino A5', signal: 'I2C Clock Line' },
    ],
    notes: 'I2C backpack reduces wiring from 12 digital pins down to just 2 analog communication lines.',
  },
];

export const BOM_ITEMS: BomItem[] = [
  {
    item: 'Arduino Uno R3 Board',
    specification: 'ATmega328P with USB-B Cable',
    qty: 1,
    purpose: 'Core control logic and ADC acquisition',
    approxCostUsd: '$8.50',
  },
  {
    item: 'Capacitive Soil Moisture Sensor',
    specification: 'v1.2 Analog Output (3.3V–5V)',
    qty: 1,
    purpose: 'Non-corrosive soil volumetric moisture sensing',
    approxCostUsd: '$2.20',
  },
  {
    item: '5V Single-Channel Relay Module',
    specification: 'Opto-isolated, Active-LOW',
    qty: 1,
    purpose: 'High-current isolation switch for DC pump',
    approxCostUsd: '$1.80',
  },
  {
    item: 'Mini Submersible Water Pump',
    specification: '3V–6V DC + 1m Silicone Tube',
    qty: 1,
    purpose: 'Delivers water from reservoir to plant pot',
    approxCostUsd: '$3.50',
  },
  {
    item: '16x2 I2C LCD Display Module',
    specification: 'PCF8574 Backpack (0x27 Addr)',
    qty: 1,
    purpose: 'Local telemetry readout for moisture & pump',
    approxCostUsd: '$3.20',
  },
  {
    item: 'Breadboard & Jumper Wires',
    specification: '400-pt Board + M-M / M-F Pack',
    qty: 1,
    purpose: 'Solderless power distribution and signal wiring',
    approxCostUsd: '$2.50',
  },
  {
    item: '5V 2A DC Power Supply',
    specification: 'Regulated Adapter / Power Bank',
    qty: 1,
    purpose: 'Dedicated current source for pump + logic',
    approxCostUsd: '$4.50',
  },
];
