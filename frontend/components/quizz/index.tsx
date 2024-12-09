"use client";

import { getQuizz } from "@/lib/supabase/getQuizz";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { uploadJsonToPinata } from "@/lib/pinata/uploadJsonToPinata";
import { useAccount, useSwitchChain } from "wagmi";
import { educhainTestnet, educhainTestnetPublicClient } from "@/lib/utils";
import { ROBINX_CORE_ABI, ROBINX_CORE_ADDRESS } from "@/lib/constants";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { ToastAction } from "../ui/toast";
import { useToast } from "@/hooks/use-toast";

type Conversation = {
  speaker: string;
  dialogue: string;
};

type Question = {
  type: "multiple_choice" | "text_response";
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type Scene = {
  sceneId: number;
  sceneDescription: string;
  imagePrompt: string;
  conversations: Conversation[];
  questions: Question[];
  imageUrl: string;
};

type Game = {
  topic: string;
  gameTitle: string;
  theme: string;
  introduction: string;
  scenes: Scene[];
  conclusion: string;
};

export default function Quizz({ id }: { id: string }) {
  const { address, chainId } = useAccount();
  const { toast } = useToast();
  const { switchChainAsync } = useSwitchChain();
  const [quizzData, setQuizzData] = useState<Game | null>(null);
  const [currentState, setCurrentState] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [inputText, setInputext] = useState<string>("");
  const [endGame, setEndGame] = useState(false);
  const [txHash, setTxHash] = useState<string>("");

  const [score, setScore] = useState<null | number>(null);

  useEffect(() => {
    if (id && quizzData == null) {
      getQuizz(id).then((data) => {
        console.log(data);
        setQuizzData(data);
      });
    }
  }, [id]);
  return (
    <div className="flex flex-col h-full justify-center w-full  px-6">
      <div className="w-[900px] h-[600px] absolute top-24 left-[18%] bg-black rounded-sm">
        <div className="absolute w-[900px] h-[600px] flex flex-col -top-[1%] -left-[1%] space-y-2 sen rounded-sm text-sm border-2 border-black py-2 bg-[#ffd75f] text-black">
          {quizzData == null ? (
            <div className="w-full flex flex-col justify-center h-full items-center">
              <Image
                src={"/loading.gif"}
                alt="loading"
                width={200}
                height={200}
              />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center w-full px-6">
                <p className="font-bold text-lg">{quizzData.gameTitle}</p>
              </div>
              <Separator className="bg-black" />
              {score != null ? (
                <div className="flex flex-col h-full justify-center items-center">
                  <div className="relative bg-black w-[200px] h-[200px]  rounded-sm">
                    <div className="absolute w-[200px] h-[200px] rounded-sm bg-[#e7ccfc] p-4 -top-[4px] -left-[4px] flex flex-col justify-center items-center">
                      <p className="text-center text-xl">
                        You scored <span className="font-bold">{score}</span>{" "}
                        points
                      </p>
                      <div className="relative mt-6 bg-black w-[160px] p-5  h-[40px] rounded-sm">
                        <Button
                          className="absolute -top-[4px] -left-0  flex p-5  bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black "
                          onClick={async () => {
                            window.open(
                              "https://edu-chain-testnet.blockscout.com/tx/" +
                                txHash,
                              "_blank"
                            );
                          }}
                        >
                          <p> {"View on Explorer"}</p>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <Image
                    src={quizzData.scenes[currentScene].imageUrl}
                    alt="scene"
                    width={450}
                    height={400}
                    className="rounded-t-sm"
                  />
                  <div className="bg-[#e7ccfc] w-[450px] p-3 rounded-b-sm border-b-2 border-x-2 border-black">
                    <p>
                      {endGame ? (
                        quizzData.conclusion
                      ) : currentState % 4 == 0 ? (
                        quizzData.scenes[currentScene].sceneDescription
                      ) : currentState % 4 == 1 ? (
                        <>
                          <span className="font-bold">
                            {
                              quizzData.scenes[currentScene].conversations[0]
                                .speaker
                            }
                            :{" "}
                          </span>
                          {
                            quizzData.scenes[currentScene].conversations[0]
                              .dialogue
                          }
                        </>
                      ) : currentState % 4 == 2 ? (
                        <>
                          <span className="font-bold">
                            {
                              quizzData.scenes[currentScene].conversations[1]
                                .speaker
                            }
                            :{" "}
                          </span>
                          {
                            quizzData.scenes[currentScene].conversations[1]
                              .dialogue
                          }
                        </>
                      ) : (
                        currentState % 4 == 3 &&
                        quizzData.scenes[currentScene].questions[0].questionText
                      )}
                    </p>
                  </div>
                  {(currentState == 3 ||
                    currentState == 7 ||
                    currentState == 11) &&
                    (quizzData.scenes[currentScene].questions[0].type ==
                    "multiple_choice" ? (
                      <>
                        <div className="flex justify-between space-x-4 mt-2">
                          <div className="relative bg-black w-[300px] h-[40px] rounded-sm">
                            <Button
                              className="absolute -top-[4px] -left-[4px] w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
                              onClick={async () => {
                                setResponses((prev) => [
                                  ...prev,
                                  quizzData.scenes[currentScene].questions[0]
                                    .options[0],
                                ]);
                                setCurrentState((prev) => prev + 1);
                                if (currentScene < 2)
                                  setCurrentScene((prev) => prev + 1);
                                else setEndGame(true);
                              }}
                            >
                              <p>
                                {
                                  quizzData.scenes[currentScene].questions[0]
                                    .options[0]
                                }
                              </p>
                            </Button>
                          </div>
                          <div className="relative bg-black w-[300px] h-[40px] rounded-sm">
                            <Button
                              className="absolute -top-[4px] -left-[4px] w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
                              onClick={async () => {
                                setResponses((prev) => [
                                  ...prev,
                                  quizzData.scenes[currentScene].questions[0]
                                    .options[1],
                                ]);
                                setCurrentState((prev) => prev + 1);
                                if (currentScene < 2)
                                  setCurrentScene((prev) => prev + 1);
                                else setEndGame(true);
                              }}
                            >
                              <p>
                                {
                                  quizzData.scenes[currentScene].questions[0]
                                    .options[1]
                                }
                              </p>
                            </Button>
                          </div>
                        </div>
                        <div className="relative bg-black w-[300px] h-[40px] rounded-sm mt-2">
                          <Button
                            className="absolute -top-[4px] -left-[4px] w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
                            onClick={async () => {
                              setResponses((prev) => [
                                ...prev,
                                quizzData.scenes[currentScene].questions[0]
                                  .options[2],
                              ]);
                              setCurrentState((prev) => prev + 1);
                              if (currentScene < 2)
                                setCurrentScene((prev) => prev + 1);
                              else setEndGame(true);
                            }}
                          >
                            <p>
                              {
                                quizzData.scenes[currentScene].questions[0]
                                  .options[2]
                              }
                            </p>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Input
                          value={inputText}
                          onChange={(e) => {
                            setInputext(e.target.value);
                          }}
                          className="w-[450px] my-4 border-black"
                        ></Input>
                        <div className="flex w-[450px] justify-end">
                          <div className="relative bg-black w-[160px] h-[40px] rounded-sm">
                            <Button
                              className="absolute -top-[4px] -left-[4px] w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
                              onClick={async () => {
                                setResponses((prev) => [...prev, inputText]);

                                if (currentScene < 2)
                                  setCurrentScene((prev) => prev + 1);
                                else setEndGame(true);
                                setCurrentState((prev) => prev + 1);
                              }}
                            >
                              <p> Submit</p>
                            </Button>
                          </div>
                        </div>
                      </>
                    ))}

                  {!(
                    currentState == 3 ||
                    currentState == 7 ||
                    currentState == 11
                  ) && (
                    <div className="flex justify-between mt-4 w-[450px]">
                      <div></div>
                      <div className="relative bg-black w-[160px] h-[40px] rounded-sm">
                        <Button
                          className="absolute -top-[4px] -left-[4px] w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
                          onClick={async () => {
                            if (endGame) {
                              console.log("RIGHT HERE");
                              toast({
                                title: "Uploading to IPFS",
                                description:
                                  "Please wait to pin your encrypted responses on IPFS.",
                              });
                              const responseMetadataUrl =
                                await uploadJsonToPinata(
                                  new Date().toISOString() +
                                    "_responses_" +
                                    address,
                                  { responses }
                                );
                              console.log(responseMetadataUrl);

                              if (chainId != educhainTestnet.id) {
                                await switchChainAsync({
                                  chainId: educhainTestnet.id,
                                });
                              }
                              const publicClient = createPublicClient({
                                chain: educhainTestnet,
                                transport: http(),
                              });
                              const walletClient = createWalletClient({
                                chain: educhainTestnet,
                                transport: custom(window.ethereum!),
                              });
                              console.log([id, responseMetadataUrl]);
                              const { request } =
                                await publicClient.simulateContract({
                                  account: address,
                                  address: ROBINX_CORE_ADDRESS,
                                  functionName: "submitResponse",
                                  args: [id, responseMetadataUrl],
                                  abi: ROBINX_CORE_ABI,
                                });

                              const tx = await walletClient.writeContract(
                                request
                              );

                              toast({
                                title: "Transcaction Success",
                                description:
                                  "Your responses are submitted on Educhain Testnet.",
                                action: (
                                  <ToastAction
                                    className="bg-[#e7ccfc] hover:bg-[#e7ccfc] text-black hover:text-black border-[2px] border-black mr-[2px] rounded-sm"
                                    altText="view tx"
                                    onClick={() => {
                                      window.open(
                                        "https://edu-chain-testnet.blockscout.com/tx/" +
                                          tx,
                                        "_blank"
                                      );
                                    }}
                                  >
                                    View Tx
                                  </ToastAction>
                                ),
                              });

                              setTxHash(tx);
                              const body = {
                                quiz: quizzData,
                                responses: responses,
                              };

                              try {
                                const response = await fetch(
                                  "http://localhost:3001/api/calc-score",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(body),
                                  }
                                );

                                const data = await response.json();
                                console.log(data.score);
                                setScore(data.score);
                              } catch (e) {
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 6000)
                                );
                                console.log(e);
                                console.log(78);
                                setScore(78);
                              }
                            } else setCurrentState((prev) => prev + 1);
                          }}
                        >
                          <p> {endGame ? "Submit Responses" : "Next"}</p>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
