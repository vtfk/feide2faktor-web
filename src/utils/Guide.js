import React from "react";
import { Heading3, Modal, Paragraph } from "@vtfk/components";


const GuideModal = ({open, close}) => {
    return (
        <>
            <Modal open={open} title='Guide' onDismiss={close}>
                <div style={{'margin-left': '1rem', 'margin-top': '-1.5rem', 'overflow': 'auto'}}>
                    <Heading3>
                        Hva er dette?
                    </Heading3>
                        <Paragraph>
                            Velkommen til Selvbetjeningsportalen for å opprette to-faktor til din konto. 
                            <br/>
                            Her kan du opprette to-faktor til din konto og du kan fjerne den eksisterende to-faktoren.
                            <br/> 
                            Anbefalte autentiserings applikasjoner er Google Authenticator som du kan laste ned fra google play eller app store. Du kan også benytte deg av WinAuth som du finner i programvaresenteret,
                            andre autentiserings applikasjoner kan også fungere. 
                        </Paragraph>
                    <br/>
                    <Heading3>
                        Hvordan skal jeg gå frem? 
                    </Heading3>
                    <Paragraph>
                        Det første du må gjøre er å logge inn med ID-Porten, ved å trykke på knappen «Login med ID-Porten»
                        <br/>                        
                        Deretter følger du stegene under.
                        <br/>
                        Om du ikke har en autentiserings applikasjon bør du installere en før du begynner.   
                    </Paragraph>
                    <br/>
                    <Heading3>
                        Har du ikke to-faktor, følg disse stegene:
                    </Heading3>
                    <Paragraph>
                        <ol>
                            <li>Trykk på knappen «Opprett to-faktor»</li>
                            <li>Scan QR-koden i den autentiserings applikasjonen du selv ønsker, eller skriv inn hemmeligheten som står under QR-koden.</li>
                            <li>Når du har gjennomført steg 2 vil det komme opp en 6-sifret kode i din autentiserings applikasjon. Skriv denne inn i feltet under og trykk på valider. Vær obs på at den 6-sifrede koden kun er gyldig i en gitt tidsperiode. Om du skulle være så uheldig å skrive inn koden og trykke på valider for sent, vil nettsiden ikke godkjenne valideringen. Prøv igjen med den nye koden.</li>
                            <li>Du har nå opprette to-faktor til din konto.</li>
                        </ol> 
                    </Paragraph>
                    <Heading3>
                        Har du to-faktor men av ulikegrunner har behov for å opprette en ny, følg disse stegene:
                    </Heading3>
                    <Paragraph>
                        <ol>
                            <li>Trykk på knappen «Opprett Ny to-faktor»</li>
                            <li>Gjennomfør stegene under overskriften «Har du ikke to-faktor»</li>
                        </ol>
                    </Paragraph>
                    <Heading3>
                        Sier nettsiden at noe gikk galt, følg disse stegene:
                    </Heading3>
                    <Paragraph>
                        <ol>
                            <li>Prøv igjen</li>
                            <ol>
                                <li>Trykk på logg ut og logg inn igjen.</li>
                                <li>Om dette ikke fungerer prøv igjen om noen timer eller neste dag.</li>
                            </ol>
                            <li>Om det ikke fungerer nå, kontakt din nærmeste IT-service desk. </li>
                        </ol>
                    </Paragraph>
                </div>
            </Modal>
        </>
    )
}

export default GuideModal