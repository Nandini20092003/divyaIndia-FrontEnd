import React, { useState, useContext } from "react";
import "./booking.css";
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/config";
import { AuthContext } from "../../context/AuthContext";

const Booking = ({ tour = {}, avgRating = 0 }) => {
  const { price = 0, reviews = [], title = "Tour" } = tour;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState({
    tourName: title,
    fullName: "",
    phone: "",
    guestSize: "1",
    bookAt: "",
  });

  const handleChange = (event) => {
    setBooking((previous) => ({
      ...previous,
      [event.target.id]: event.target.value,
    }));
  };

  const serviceFee = 1000;
  const guestCount = Math.max(1, Number(booking.guestSize) || 1);
  const totalAmount = Number(price) * guestCount + serviceFee;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      alert("Please sign in to make a booking.");
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tourName: title,
          fullName: booking.fullName,
          phone: booking.phone,
          guestSize: Number(booking.guestSize),
          bookAt: booking.bookAt,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        alert(result.message || "Unable to create booking");
        return;
      }
      navigate("/thank-you");
    } catch {
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking">
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>₹{price} <span>/per person</span></h3>
        <span className="tour__rating d-flex align-items-center">
          <i className="ri-star-s-fill"></i> {avgRating || "N/A"} ({reviews.length})
        </span>
      </div>

      <div className="booking__form">
        <h5>Information</h5>
        <Form className="booking__info-form" onSubmit={handleSubmit}>
          <FormGroup>
            <input type="text" placeholder="Full Name" id="fullName" required
              minLength={2} maxLength={100} value={booking.fullName} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <input type="tel" placeholder="Phone" id="phone" required
              pattern="[0-9]{7,15}" value={booking.phone} onChange={handleChange} />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <input type="date" id="bookAt" required value={booking.bookAt} onChange={handleChange} />
            <input type="number" placeholder="Guests" id="guestSize" required
              min="1" max="20" value={booking.guestSize} onChange={handleChange} />
          </FormGroup>
          <div className="booking__bottom">
            <ListGroup>
              <ListGroupItem className="border-0 px-0">
                <h5>₹{price} × {guestCount} guests</h5>
                <span>₹{Number(price) * guestCount}</span>
              </ListGroupItem>
              <ListGroupItem className="border-0 px-0">
                <h5>Service Charge</h5><span>₹{serviceFee}</span>
              </ListGroupItem>
              <ListGroupItem className="border-0 px-0 total">
                <h5>Total</h5><span>₹{totalAmount}</span>
              </ListGroupItem>
            </ListGroup>
            <Button className="btn primary__btn w-100 mt-4" type="submit" disabled={submitting}>
              {submitting ? "Booking..." : "Book Now"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Booking;
