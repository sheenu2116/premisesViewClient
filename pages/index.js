import logo from "../public/premises_view.jpg";
import Image from "next/image";
import publicRoute from "../components/PublicRoute";
import ValidatedForm from "../components/ValidatedForm";
import { useMutation } from "@apollo/client";
import { createLead as createLeadtMutation } from "../graphql/mutations/Leads.gql";
import handleApolloResponse from "../lib/handleApolloResponse";
import { useQuery } from "@apollo/client";
import { leads as leadsQuery } from "../graphql/queries/Leads.gql";

import StyledHomePage from "./index.css";
import { useState } from "react";
import pong from "../lib/pong";
import { monthDayYear } from "../lib/dates";

const HomePage = () => {
  const [email, updateEmail] = useState("");
  
  const [createLead] = useMutation(createLeadtMutation);

  const { loading, data } = useQuery(leadsQuery, {
    fetchPolicy: 'network-only'
  });

  const handleSubmit = () => {
    
    createLead({
        variables: {
          lead: {
            email,
          },
        },
      }).then((response) => {
        return handleApolloResponse({
          queryName: "createLead",
          response,
          onSuccess: console.log,
          onError: pong.danger,
        });
      });
  };
  return (
    <StyledHomePage>
      <h1>Premises View</h1>
      <br />
      <Image height={512} width={512} src={logo} />
      <h4>
        Please drop your email address here if you are excited to be a part of
        the metaverse!
      </h4>
      <ValidatedForm
        rules={{
          emailAddress: {
            required: true,
            email: true,
          },
        }}
        messages={{
          emailAddress: {
            required: "Email address is required.",
            email: "Is this a valid email?",
          },
        }}
        onSubmit={() => {
          handleSubmit();
        }}
      >
        <form>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="text"
              name="emailAddress"
              className="form-control"
              placeholder="Email Address"
              value={email}
              onChange={(event) => updateEmail(event.target.value)}
            />
          </div>
        </form>
      </ValidatedForm>
      {!loading && data.leads && data.leads.length > 0 && (
      <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th className="text-center">Created At</th>
                <th className="text-center">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map(({ _id, email, createdAt, updatedAt }) => {
                return (
                  <tr key={_id} className="align-middle">
                    <td>{email}</td>
                    <td className="text-center">{monthDayYear(createdAt)}</td>
                    <td className="text-center">{monthDayYear(updatedAt)}</td>
                   
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </StyledHomePage>
  );
};

export default publicRoute(HomePage);
