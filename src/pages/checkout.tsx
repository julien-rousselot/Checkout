
import { useState } from "react";
import type { NextPage } from "next";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import Head from "next/head";
import Image from "next/legacy/image";
import { Container, Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";
import type { StaticImageData } from "next/image";
import { CreditCard, Check2Circle, ArrowClockwise, Truck } from "react-bootstrap-icons";
import masterCard from "../../public/mastercard.png";
import visaCard from "../../public/visa.png";
import montessori from "../../public/montessori.jpg";
import logo from "../../public/logo.png";

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: StaticImageData
}

const CheckoutPage: NextPage = () => {
  const [order, setOrder] = useState<OrderItem[]>([
    {
      id: "1",
      name: "Montessori Multi-Usage Observation Tower",
      price: 39.9,
      quantity: 1,
      image: montessori,
    },
  ])

  const [discountCode, setDiscountCode] = useState<string>("")
  const [differentBillingAddress, setDifferentBillingAddress] = useState<boolean>(false)

  const subtotal = order.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const taxes: number = 0
  const shipping: number = 0
  const total = subtotal + taxes + shipping
  const stripe = useStripe();
  const elements = useElements();

  // Function to validate datas and handle the payment
  const handlePay = async () => {
    if (!stripe || !elements) {
      return;
    }

  // Get the cards elements
  const cardNumberElement = elements.getElement(CardNumberElement);
  const cardExpiryElement = elements.getElement(CardExpiryElement);
  const cardCvcElement = elements.getElement(CardCvcElement);

  // Validation that the element are not null
  if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
    alert("Erreur lors de la récupération des informations de la carte.");
    return;
  }

  // Create the PaymentMethod with the cards elements
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: "card",
    card: cardNumberElement,
  });

  if (error) {
    alert("Erreur lors du paiement.");
    return;
  }

  // send data to the back (payment.ts in our case)
  const paymentData = {
    paymentMethodId: paymentMethod.id,
  };
    try {
      const response = await fetch("http://localhost:3000/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      
      if (result.message === "Payment successful") {
        alert("Paiement effectué avec succès !");
      } else {
        alert("Une erreur s'est produite lors du traitement du paiement.");
      }
    } catch (error) {
      alert("Erreur lors du paiement.");
    }
  };

  return (
    <>
      <Head>
        <title>Checkout</title>
        <meta name="description" content="Checkout page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="py-3 border-bottom bg-white">
        <Container>
          <Row className="align-items-center">
            <Col xs={6}>
              <Image src={logo} alt="Logo" width={80} height={50} objectFit="contain" />
            </Col>
            <Col xs={6} className="text-end">
              <a href="#" className="text-decoration-none text-dark">
                Panier <span className="ms-2">🛒</span>
              </a>
            </Col>
          </Row>
        </Container>
      </header>

      <Container className="py-4">
        <Row>
          <Col lg={7}>

            {/* Contact */}
            <div className="mb-4">
              <h2>Contact</h2>
              <p className="text-muted small">Entrez vos informations de contact</p>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Indiquez votre email" />
              </Form.Group>

              <Form.Group className="mb-3">
                <input type="checkbox" id="marketingEmails" className="custom-checkbox"/>
                <label className="ps-2" htmlFor="marketingEmails">
                  J'accepte de recevoir des emails marketing
                </label>
              </Form.Group>
            </div>

            {/* Adresse de Livraison */}
            <div className="mb-4">
              <h2>Adresse de Livraison</h2>
              <p className="text-muted small">Entrez votre adresse de livraison</p>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control type="text" placeholder="Indiquez votre prénom" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Nom</Form.Label>
                    <Form.Control type="text" placeholder="Indiquez votre nom" />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Adresse</Form.Label>
                <Form.Control type="text" placeholder="123 rue principale, ville, Pays" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Adresse complémentaire (optionnel)</Form.Label>
                <Form.Control type="text" placeholder="Adresse complémentaire" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Pays</Form.Label>
                <Form.Select>
                  <option>Sélectionnez un pays</option>
                  <option value="FR">France</option>
                  <option value="BE">Belgique</option>
                  <option value="CH">Suisse</option>
                  <option value="CA">Canada</option>
                </Form.Select>
              </Form.Group>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Ville</Form.Label>
                    <Form.Control type="text" placeholder="Indiquez votre ville" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>État</Form.Label>
                    <Form.Control type="text" placeholder="Indiquez votre état" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Code Postal</Form.Label>
                    <Form.Control type="text" placeholder="Indiquez votre code postal" />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control type="tel" placeholder="Indiquez votre numéro de téléphone" />
              </Form.Group>

              <Form.Group className="mb-3">
                <input type="checkbox" id="differentBillingAddress" checked={differentBillingAddress} onChange={(e) => setDifferentBillingAddress(e.target.checked)} className="custom-checkbox"  />
                <label className="ps-2" htmlFor="marketingEmails">
                  J'accepte de recevoir des emails marketing
                </label>
              </Form.Group>
            </div>

            {/* Méthode de Livraison */}
            <div className="mb-4">
              <h2>Méthode de Livraison</h2>
              <p className="text-muted small">Sélectionnez votre méthode de livraison ci-dessous</p>

              <Card className="mb-3 bg-light">
                <Card.Body>
                  <p className="mb-0 fw-bold">Information</p>
                  <p className="mb-0 small">Sélectionnez un pays pour voir les méthodes d'expédition disponibles</p>
                </Card.Body>
              </Card>
            </div>

            {/* Paiement */}
            <div className="mb-4">
              <h2>Paiement</h2>
              <p className="text-muted small">
                Sélectionnez votre méthode de paiement ci-dessous. Toutes les transactions sont sécurisées et cryptées
              </p>

              <Card className="mb-3 border-warning">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <CreditCard className="text-warning me-2" />
                    <span>Carte de crédit</span>
                  </div>
                  <div>
                    <span className="text-warning">✓</span>
                  </div>
                </Card.Body>
              </Card>
              {/* Payment Form */}
              <Form.Group className="mb-3">
                <Form.Label>Numéro de carte</Form.Label>
                <InputGroup>
                  <div className="form-group w-100">
                    {/* Numéro de carte */}
                    <div className="form-control p-2">
                      <CardNumberElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#495057",
                              "::placeholder": { color: "#6c757d" },
                              fontFamily: "Arial, sans-serif",
                              padding: "10px",
                            },
                            invalid: { color: "#dc3545" },
                          },
                        }}
                      />
                    </div>

                    {/* Date d'expiration et CVV alignés côte à côte */}
                    <div className="mt-3 d-flex justify-content-between w-100">
                      {/* Date d'expiration */}
                      <div className="w-50 me-2">
                        <Form.Label>Date d'exp</Form.Label>
                        <div className="form-control p-2">
                          <CardExpiryElement
                            options={{
                              style: {
                                base: {
                                  fontSize: "16px",
                                  color: "#495057",
                                  "::placeholder": { color: "#6c757d" },
                                  fontFamily: "Arial, sans-serif",
                                  padding: "10px",
                                },
                                invalid: { color: "#dc3545" },
                              },
                            }}
                          />
                        </div>
                      </div>

                      {/* CVC/CVV */}
                      <div className="w-50">
                        <Form.Label>CVC/CVV</Form.Label>
                        <div className="form-control p-2">
                          <CardCvcElement
                            options={{
                              style: {
                                base: {
                                  fontSize: "16px",
                                  color: "#495057",
                                  "::placeholder": { color: "#6c757d" },
                                  fontFamily: "Arial, sans-serif",
                                  padding: "10px",
                                },
                                invalid: { color: "#dc3545" },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </InputGroup>
              </Form.Group>

              <Button onClick={handlePay} variant="warning" className="w-100 py-3 text-white fw-bold">
                <span className="me-2">🔒</span> Payer
              </Button>

              <div className="text-center mt-3 small text-muted">
                <span className="me-2">🔒</span> Toutes les transactions sont sécurisées et cryptées
              </div>

              <div className="text-center mt-3">
                <Image src={visaCard} width={50} height={30} alt="Visa" className="pe-2" />
                <Image src={masterCard} width={50} height={30} alt="Mastercard" className="pe-2"/>
              </div>
            </div>
          </Col>

          <Col lg={5}>
            <Card className="border-0 bg-light">
              <Card.Body>
                <h2 className="mb-4">Votre commande</h2>

                {order.map((item) => (
                  <div key={item.id} className="d-flex mb-3">
                    <div className="me-3 position-relative" style={{ width: "60px", height: "60px" }}>
                      <Image
                        src={item.image || "/placeholder.svg"}
                        layout="fill"
                        objectFit="cover"
                        alt={item.name}
                        className="rounded"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{item.name}</h6>
                      <p className="text-muted small mb-0">Default Title</p>
                    </div>
                    <div className="ms-3">
                      <p className="mb-0">€{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <div className="mb-3">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Code de réduction"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <Button variant="outline-secondary">
                      Appliquer
                    </Button>
                  </InputGroup>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <span>Sous-total · {order.length} items</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Livraison</span>
                  <span>{shipping === 0 ? "-" : `€${shipping.toFixed(2)}`}</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Taxes estimées</span>
                  <span>€{taxes.toFixed(2)}</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4 fw-bold">
                  <h5>Total</h5>
                  <h5>€{total.toFixed(2)}</h5>
                </div>

                <div className="mb-3">
                  <div className="d-flex mb-2">
                    <div className="me-2 text-success">
                      <Check2Circle size={20} />
                    </div>
                    <div>
                      <p className="mb-0 fw-bold">Service Client</p>
                      <p className="mb-0 small text-muted">
                        Nous répondons à vos questions du lundi au vendredi de 9h à 17h.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex mb-2">
                    <div className="me-2 text-success">
                      <ArrowClockwise size={20} />
                    </div>
                    <div>
                      <p className="mb-0 fw-bold">Satisfait ou remboursé 30 jours</p>
                      <p className="mb-0 small text-muted">
                        Insatisfait ? Remboursement facile et sans condition. Votre satisfaction est notre priorité.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex mb-2">
                    <div className="me-2 text-success">
                      <Truck size={20} />
                    </div>
                    <div>
                      <p className="mb-0 fw-bold">Expédition en 48h</p>
                      <p className="mb-0 small text-muted">
                        Bénéficiez d'une expédition ultra-rapide avec suivi en seulement 48 heures.
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default CheckoutPage

