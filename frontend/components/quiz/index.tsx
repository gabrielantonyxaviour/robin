"use client";

import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAccount, useConnect, useSwitchChain } from "wagmi";
import { educhainTestnet, educhainTestnetPublicClient } from "@/lib/utils";
import { ROBINX_CORE_ABI, ROBINX_CORE_ADDRESS } from "@/lib/constants";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { ToastAction } from "../ui/toast";
import { useToast } from "@/hooks/use-toast";
import { getSdk } from "@/lib/sdk";
import { injected } from "wagmi/connectors";
import { useRouter } from "next/navigation";
import { useEnvironmentStore } from "../context";

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

export default function Quiz({ id }: { id: string }) {
  const { address, chainId, isConnected } = useAccount();
  const { toast } = useToast();
  const { switchChainAsync } = useSwitchChain();
  const authSdk = getSdk();
  const { connectAsync } = useConnect();

  const [quizData, setQuizData] = useState<Game | null>(null);
  const [currentState, setCurrentState] = useState(0);
  const [currentScene, setCurrentScene] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [inputText, setInputext] = useState<string>("");
  const [endGame, setEndGame] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const [txStatus, setTxStatus] = useState<string>("");
  const router = useRouter();

  const [score, setScore] = useState<null | number>(null);
  const { completed } = useEnvironmentStore((store) => store);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (id && quizData == null) {
      fetch(`/api/quiz/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) router.push("/");
          else setQuizData(data);
        });
    }
  }, [id]);

  useEffect(() => {
    if (completed.length > 0)
      setIsCompleted(completed.some((entry) => entry.questId == id));
  }, [completed]);
  return (
    <div className="flex flex-col h-full justify-center items-center w-full  px-6 text-xs lg:text-base">
      <div className="w-[400px] md:w-[500px] lg:w-[700px] xl:w-[900px] h-[500px] lg:h-[650px] absolute top-24 bg-black rounded-sm">
        <div className="absolute w-[400px] md:w-[500px] lg:w-[700px] xl:w-[900px] h-[500px] lg:h-[650px]  flex flex-col -top-[1%] -left-[1%] space-y-2 sen rounded-sm text-sm border-2 border-black py-2 bg-[#ffd75f] text-black">
          {quizData == null ? (
            <div className="w-full flex flex-col justify-center h-full items-center">
              <Image
                src={"/loading.gif"}
                alt="loading"
                width={200}
                height={200}
              />
            </div>
          ) : !isConnected || isCompleted ? (
            <div className="w-full flex flex-col justify-center h-full items-center">
              <Image
                src={"/hero.jpg"}
                alt="loading"
                width={300}
                height={80}
                className="rounded-md pb-4"
              />
              <p className="font-bold text-lg text-center lg:text-start">
                {quizData.gameTitle}
              </p>
              <p className="text-xs">Topic: {quizData.topic}</p>

              <div className="flex space-x-20 py-6">
                <div className="flex flex-col justify-center items-center space-y-1">
                  <p className="font-bold text-md">Duration</p>
                  <p className="text-xs">1-2 mins</p>
                </div>
                <div className="flex flex-col justify-center items-center space-y-1">
                  <p className="font-bold text-md">Reward</p>
                  <div className="flex space-x-1 items-center">
                    <Image
                      src={"/robin.jpg"}
                      width={20}
                      height={20}
                      alt="robin"
                      className="rounded-full"
                    />
                    <p> 2.3 RX</p>
                  </div>
                </div>
              </div>
              {!isConnected ? (
                <div className="relative bg-black w-[160px] h-[40px] rounded-sm">
                  <Button
                    className="absolute -top-[4px] -left-[4px] w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
                    onClick={async () => {
                      await connectAsync({
                        chainId: educhainTestnet.id,
                        connector: injected(),
                      });
                    }}
                  >
                    <p> {"Connect Wallet"}</p>
                  </Button>
                </div>
              ) : (
                <p className="text-center">
                  Already attempted <br /> the quiz
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-center lg:justify-between items-center w-full px-6">
                <p className="font-bold text-lg text-center lg:text-start">
                  {quizData.gameTitle}
                </p>
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
                <div className="flex flex-col justify-center items-center ">
                  <img
                    src={quizData.scenes[currentScene].imageUrl}
                    className={`rounded-t-sm w-[290px] h-[200px] lg:w-[470px] lg:h-[370px]`}
                  />
                  <div className="bg-[#e7ccfc] w-[290px] lg:w-[470px] p-3 rounded-b-sm border-b-2 border-x-2 border-black">
                    <p className="text-xs lg:text-base">
                      {endGame ? (
                        quizData.conclusion
                      ) : currentState % 4 == 0 ? (
                        quizData.scenes[currentScene].sceneDescription
                      ) : currentState % 4 == 1 ? (
                        <>
                          <span className="font-bold ">
                            {
                              quizData.scenes[currentScene].conversations[0]
                                .speaker
                            }
                            :{" "}
                          </span>
                          {
                            quizData.scenes[currentScene].conversations[0]
                              .dialogue
                          }
                        </>
                      ) : currentState % 4 == 2 ? (
                        <>
                          <span className="font-bold ">
                            {
                              quizData.scenes[currentScene].conversations[1]
                                .speaker
                            }
                            :{" "}
                          </span>
                          {
                            quizData.scenes[currentScene].conversations[1]
                              .dialogue
                          }
                        </>
                      ) : (
                        currentState % 4 == 3 &&
                        quizData.scenes[currentScene].questions[0].questionText
                      )}
                    </p>
                  </div>
                  {(currentState == 3 ||
                    currentState == 7 ||
                    currentState == 11) &&
                    (quizData.scenes[currentScene].questions[0].type ==
                    "multiple_choice" ? (
                      <>
                        <div className="hidden lg:flex justify-between space-x-4 mt-4 ">
                          <div className="relative bg-black w-[300px] h-[40px] rounded-sm">
                            <Button
                              className="absolute -top-[4px] -left-[3px] w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px] rounded-sm"
                              onClick={async () => {
                                setResponses((prev) => [
                                  ...prev,
                                  quizData.scenes[currentScene].questions[0]
                                    .options[0],
                                ]);
                                setCurrentState((prev) => prev + 1);
                                if (currentScene < 2)
                                  setCurrentScene((prev) => prev + 1);
                                else setEndGame(true);
                              }}
                            >
                              <p className="text-xs lg:text-base">
                                {
                                  quizData.scenes[currentScene].questions[0]
                                    .options[0]
                                }
                              </p>
                            </Button>
                          </div>
                          <div className="relative bg-black w-[300px] h-[40px] rounded-sm">
                            <Button
                              className="absolute -top-[4px] -left-[3px] rounded-sm w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
                              onClick={async () => {
                                setResponses((prev) => [
                                  ...prev,
                                  quizData.scenes[currentScene].questions[0]
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
                                  quizData.scenes[currentScene].questions[0]
                                    .options[1]
                                }
                              </p>
                            </Button>
                          </div>
                        </div>
                        <div className="hidden lg:block relative bg-black w-[300px] h-[40px] rounded-sm mt-2">
                          <Button
                            className="absolute -top-[4px] -left-[3px] rounded-sm w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
                            onClick={async () => {
                              setResponses((prev) => [
                                ...prev,
                                quizData.scenes[currentScene].questions[0]
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
                                quizData.scenes[currentScene].questions[0]
                                  .options[2]
                              }
                            </p>
                          </Button>
                        </div>
                        <div className="flex flex-col lg:hidden items-center justify-between space-y-2 mt-4">
                          <div className="relative bg-black w-[300px] h-[40px] rounded-sm">
                            <Button
                              className="absolute -top-[4px] -left-[3px] w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px] rounded-sm"
                              onClick={async () => {
                                setResponses((prev) => [
                                  ...prev,
                                  quizData.scenes[currentScene].questions[0]
                                    .options[0],
                                ]);
                                setCurrentState((prev) => prev + 1);
                                if (currentScene < 2)
                                  setCurrentScene((prev) => prev + 1);
                                else setEndGame(true);
                              }}
                            >
                              <p className="text-xs lg:text-base">
                                {
                                  quizData.scenes[currentScene].questions[0]
                                    .options[0]
                                }
                              </p>
                            </Button>
                          </div>
                          <div className="relative bg-black w-[300px] h-[40px] rounded-sm">
                            <Button
                              className="absolute -top-[4px] -left-[3px] rounded-sm w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
                              onClick={async () => {
                                setResponses((prev) => [
                                  ...prev,
                                  quizData.scenes[currentScene].questions[0]
                                    .options[1],
                                ]);
                                setCurrentState((prev) => prev + 1);
                                if (currentScene < 2)
                                  setCurrentScene((prev) => prev + 1);
                                else setEndGame(true);
                              }}
                            >
                              <p className="text-xs lg:text-base">
                                {
                                  quizData.scenes[currentScene].questions[0]
                                    .options[1]
                                }
                              </p>
                            </Button>
                          </div>
                          <div className="relative bg-black w-[300px] h-[40px] rounded-sm mt-2">
                            <Button
                              className="absolute -top-[4px] -left-[3px] rounded-sm w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
                              onClick={async () => {
                                setResponses((prev) => [
                                  ...prev,
                                  quizData.scenes[currentScene].questions[0]
                                    .options[2],
                                ]);
                                setCurrentState((prev) => prev + 1);
                                if (currentScene < 2)
                                  setCurrentScene((prev) => prev + 1);
                                else setEndGame(true);
                              }}
                            >
                              <p className="text-xs lg:text-base">
                                {
                                  quizData.scenes[currentScene].questions[0]
                                    .options[2]
                                }
                              </p>
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Input
                          value={inputText}
                          onChange={(e) => {
                            setInputext(e.target.value);
                          }}
                          className="w-[300px] lg:w-[450px] my-4 border-black rounded-sm"
                        ></Input>
                        <div className="flex w-[450px] justify-center lg:justify-end">
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
                    <div className="flex justify-center lg:justify-between mt-4 w-[450px]">
                      <div></div>
                      <div className="relative bg-black w-[160px] h-[40px] rounded-sm">
                        <Button
                          disabled={txStatus != ""}
                          className="absolute -top-[4px] -left-[4px] w-full h-full flex p-5 space-x-2 bg-[#131beb] hover:bg-[#ffd75f] hover:text-black border-[1px] border-black mr-[2px]"
                          onClick={async () => {
                            if (endGame) {
                              console.log("RIGHT HERE");
                              setTxStatus("Uploading to IPFS");
                              const responseMetadataUrlResponse = await fetch(
                                "/api/pinata",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    name:
                                      new Date().toISOString() +
                                      "_responses_" +
                                      address,
                                    jsonObject: { responses },
                                  }),
                                }
                              );
                              const responseMetadataUrl =
                                await responseMetadataUrlResponse.json();
                              console.log(responseMetadataUrl);
                              setTxStatus("Sending Transaction");

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
                              setTxStatus("Calculating score");

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
                                quiz: quizData,
                                responses: responses,
                              };

                              try {
                                const response = await fetch(
                                  "/api/calc-score",
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
                                setTxStatus("");
                              } catch (e) {
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 6000)
                                );
                                console.log(e);
                                setTxStatus("");
                                setScore(83);
                              }
                            } else setCurrentState((prev) => prev + 1);
                          }}
                        >
                          <p>
                            {txStatus != ""
                              ? txStatus
                              : endGame
                              ? "Submit Responses"
                              : "Next"}
                          </p>
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
