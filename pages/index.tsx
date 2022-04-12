import path from "path";
import fs from "fs";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useCallback, useEffect, useState } from "react";
import cx from "classnames";

let resultTimeout: NodeJS.Timeout;

type Props = {
  membershipIds: number[];
};

const Home: NextPage<Props> = ({ membershipIds: memIds }) => {
  const [membershipIds, setMembershipIds] = useState(memIds);
  const [membershipId, setMembershipId] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isValidMembership, setIsValidMembership] = useState<boolean>();
  const [isResultVisible, setIsResultVisible] = useState(false);

  const handleValidationClick = useCallback(() => {
    const normalizedMembershipId = parseInt(membershipId, 10);
    const isValidMembershipId = membershipIds.includes(normalizedMembershipId);
    setIsValidMembership(isValidMembershipId);
    setIsResultVisible(true);
  }, [membershipIds, membershipId, setIsValidMembership]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMembershipId(event.target.value);
  };

  useEffect(() => {
    setLoading(true);

    fetch('/membership_ids.json', { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setMembershipIds(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false)
        alert(`MembershipIds couldn't be updated. ${err}`)
      })
  }, []);

  useEffect(() => {
    if (isResultVisible) {
      clearTimeout(resultTimeout);
      resultTimeout = setTimeout(() => {
        setIsResultVisible(false);
      }, 2000);
    }
  }, [isResultVisible]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Surf Club Kiel e.V. Membership Validator</title>
        <meta
          name="description"
          content="Surf Club Kiel e.V. Membership Validator"
        />
        <link rel="icon" href="/Surf-Club-Kiel-Logo-100x100.png" />
      </Head>

      <main className={styles.main}>
        <span className={styles.logo}>
          <img src="/SCK_blau.png" alt="SCK Logo" width={150} height={150} />
        </span>

        <h1 className={styles.title}>Membership Validator</h1>

        {!isLoading && <div className={styles.form}>
          <input
            type="number"
            className={styles.input}
            placeholder="Mitgliedsnummer"
            value={membershipId}
            onChange={handleInputChange}
          />
          <button className={styles.button} onClick={handleValidationClick}>
            Prüfen
          </button>
        </div>}

        {isLoading && <div className={styles.form}>Loading...</div>}

        <div
          className={cx(styles.checkResult, {
            [styles.checkResultVisible]: isResultVisible,
          })}
        >
          {isValidMembership ? (
            <img
              src="/check_circle.svg"
              alt="Found"
              width={100}
              height={100}
            />
          ) : (
            <img
              src="/cancel_circle.svg"
              alt="Found"
              width={100}
              height={100}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const postsDirectory = path.join(
    process.cwd(),
    "public",
    "membership_ids.json"
  );
  const fileContent = fs.readFileSync(postsDirectory, "utf-8");
  let membershipIds; 

  try {
    membershipIds = JSON.parse(fileContent);
  } catch {
    console.error("Can't parse the membership ids.")
  }

  return {
    props: {
      membershipIds,
    },
  };
};

export default Home;
