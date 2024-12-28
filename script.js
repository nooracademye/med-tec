document.addEventListener("DOMContentLoaded", () => {
    const cartKey = "quickMedCart";
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    // Function to save cart to localStorage
    const saveCart = () => localStorage.setItem(cartKey, JSON.stringify(cart));

    // Cart page functionalities
    if (document.getElementById("cartItems")) {
        const cartItemsElement = document.getElementById("cartItems");
        const cartControls = document.getElementById("cartControls");
        const emptyCartMessage = document.getElementById("emptyCartMessage");

        // Function to render cart items and update the cart display
        const renderCart = () => {
            cartItemsElement.innerHTML = "";
            if (cart.length === 0) {
                emptyCartMessage.style.display = "block";
                cartControls.style.display = "none";
            } else {
                emptyCartMessage.style.display = "none";
                cartControls.style.display = "block";
                cart.forEach((item, index) => {
                    const li = document.createElement("li");
                    li.innerHTML = `${item.name} - $${item.price.toFixed(2)} 
                        <button data-index="${index}" class="remove-btn">Remove</button>`;
                    cartItemsElement.appendChild(li);
                });

                // Add event listeners to remove buttons
                document.querySelectorAll(".remove-btn").forEach(button => {
                    button.addEventListener("click", (event) => {
                        const index = event.target.dataset.index;
                        cart.splice(index, 1); // Remove item from cart array
                        saveCart(); // Save updated cart to localStorage
                        renderCart(); // Re-render cart
                    });
                });
            }
        };

        // Clear cart button functionality
        document.getElementById("clearCartBtn").addEventListener("click", () => {
            if (confirm("Are you sure you want to clear the cart?")) {
                cart = []; // Empty the cart
                saveCart(); // Save empty cart to localStorage
                renderCart(); // Re-render cart
            }
        });

        // Checkout button functionality
        document.getElementById("checkoutBtn").addEventListener("click", () => {
            if (cart.length > 0) {
                window.location.href = "checkout.html"; // Redirect to checkout page if cart is not empty
            } else {
                alert("Your cart is empty. Please add some items before proceeding to checkout.");
            }
        });

        renderCart(); // Render cart when the page is loaded
    }

    // Add to Cart functionality (on product pages)
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const item = {
                name: button.dataset.item, // Item name from the button's data-attribute
                price: parseFloat(button.dataset.price), // Item price from the button's data-attribute
            };
            cart.push(item); // Add item to the cart array
            saveCart(); // Save updated cart to localStorage
        });
    });

    // Checkout page functionality
    if (document.getElementById("orderSummary")) {
        const orderItemsElement = document.getElementById("orderItems");
        const orderTotalElement = document.getElementById("orderTotal");

        // Function to render order summary on the checkout page
        const renderOrderSummary = () => {
            orderItemsElement.innerHTML = ""; // Clear previous summary
            let total = 0;
            cart.forEach(item => {
                const li = document.createElement("li");
                li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
                orderItemsElement.appendChild(li);
                total += item.price; // Add item price to total
            });
            orderTotalElement.textContent = total.toFixed(2); // Display total price
        };

        // Handle the form submission for payment
        document.getElementById("paymentForm").addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent default form submission

            alert("Order Confirmed! Thank you for shopping with us."); // Show confirmation message

            cart = []; // Clear the cart after successful checkout
            saveCart(); // Save the empty cart to localStorage
            renderOrderSummary(); // Re-render the order summary (it will now be empty)
        });

        renderOrderSummary(); // Render order summary on page load
    }

    // Store Page functionality (handle add to cart from store)
    if (document.getElementById("storePage")) {
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", () => {
                const item = {
                    name: button.dataset.item, // Item name from the button's data-attribute
                    price: parseFloat(button.dataset.price), // Item price from the button's data-attribute
                };
                cart.push(item); // Add item to the cart array
                saveCart(); // Save updated cart to localStorage
            });
        });
    }

    // Reservation Page (Book a Service functionality)
    if (document.getElementById("bookingForm")) {
        const bookingForm = document.getElementById("bookingForm");
        const today = new Date().toISOString().split("T")[0]; // Get today's date in yyyy-mm-dd format
        document.getElementById("date").setAttribute("min", today); // Set the minimum date to today

        bookingForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const service = document.getElementById("service").value;
            const date = document.getElementById("date").value;
            const time = document.getElementById("time").value;

            alert(`Thank you, ${name}! Your booking for ${service} on ${date} at ${time} has been confirmed.`);

            // Save booking to localStorage or send it to a server
            const bookingData = { name, email, service, date, time };
            localStorage.setItem("latestBooking", JSON.stringify(bookingData));

            // Optionally redirect or reset the form
            bookingForm.reset();
        });
    }

    // Reservation Schedule Page functionality (Display user's past reservations)
    if (document.getElementById("scheduleContainer")) {
        const scheduleContainer = document.getElementById("scheduleContainer");
        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

        if (bookings.length === 0) {
            scheduleContainer.innerHTML = "<p>No reservations found. Book your service today!</p>";
        } else {
            const scheduleList = bookings.map(booking => `
                <div class="reservation">
                    <h3>${booking.service}</h3>
                    <p><strong>Name:</strong> ${booking.name}</p>
                    <p><strong>Email:</strong> ${booking.email}</p>
                    <p><strong>Date:</strong> ${booking.date}</p>
                    <p><strong>Time:</strong> ${booking.time}</p>
                </div>
            `).join("");
            scheduleContainer.innerHTML = scheduleList;
        }
    }

    // Additional global functions or page-specific scripts can be added below
});
