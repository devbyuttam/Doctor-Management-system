const Appointment = require("../models/Appointment");

function generateSlots(startTime, endTime, durationMinutes) {
  const slots = [];
  let [startHour, startMin] = startTime.split(":").map(Number);
  let [endHour, endMin] = endTime.split(":").map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMin < endMin)
  ) {
    const formattedHour = currentHour.toString().padStart(2, "0");
    const formattedMin = currentMin.toString().padStart(2, "0");
    slots.push(`${formattedHour}:${formattedMin}`);

    currentMin += durationMinutes;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }

  return slots;
}

async function getAvailableSlots(doctorId, date, doctorAvailability) {
  const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });
  const dayAvail = doctorAvailability.find(
    (d) => d.day === dayOfWeek && d.isAvailable,
  );

  if (!dayAvail) return [];

  const allSlots = generateSlots(
    dayAvail.startTime,
    dayAvail.endTime,
    dayAvail.slotDurationMinutes,
  );

  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const bookedAppointments = await Appointment.find({
    doctorId,
    date: { $gte: startOfDay, $lte: endOfDay },
    status: { $nin: ["cancelled", "rejected"] },
  });

  const bookedSlots = bookedAppointments.map((app) => app.startTime);

  return allSlots.filter((slot) => !bookedSlots.includes(slot));
}

module.exports = { generateSlots, getAvailableSlots };
