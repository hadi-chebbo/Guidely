"use client";

const CLIENT_SECRET_PREFIX = "guidely_payment_client_secret:";

export const saveReservationClientSecret = (
  reservationUuid: string,
  clientSecret: string,
) => {
  window.sessionStorage.setItem(
    `${CLIENT_SECRET_PREFIX}${reservationUuid}`,
    clientSecret,
  );
};

export const getReservationClientSecret = (reservationUuid: string) =>
  window.sessionStorage.getItem(`${CLIENT_SECRET_PREFIX}${reservationUuid}`);

export const clearReservationClientSecret = (reservationUuid: string) => {
  window.sessionStorage.removeItem(`${CLIENT_SECRET_PREFIX}${reservationUuid}`);
};
