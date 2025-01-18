"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MessageSquare, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface PhoneNumber {
  id: string
  verified_name: string
  display_phone_number: string
  quality_rating: string
  code_verification_status?: string
  whatsapp_registered: boolean
}

interface PhoneNumberListProps {
  phoneNumbers: PhoneNumber[]
  onUpdate: () => void
}

export function PhoneNumberList({ phoneNumbers, onUpdate }: PhoneNumberListProps) {
  const router = useRouter()
  const [registrationOpen, setRegistrationOpen] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState<PhoneNumber | null>(null)
  const [pin, setPin] = useState("")
  const [loading, setLoading] = useState(false)

  const handleUseNumber = (phoneNumber: PhoneNumber) => {
    localStorage.setItem('selectedFromNumber', JSON.stringify(phoneNumber))
    router.push('/dashboard/campaigns/new')
  }

  const handleRegister = async () => {
    if (!selectedNumber) return
    if (!pin || pin.length !== 6) {
      toast.error("Please enter a valid 6-digit PIN")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/v1/whatsapp/register-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number_id: selectedNumber.id,
          pin: pin
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to register phone number")
      }

      toast.success("Phone number registered successfully")
      setRegistrationOpen(false)
      setPin("")
      setSelectedNumber(null)
      onUpdate() // Refresh the list
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to register phone number")
    } finally {
      setLoading(false)
    }
  }

  const openRegistration = (number: PhoneNumber) => {
    setSelectedNumber(number)
    setRegistrationOpen(true)
  }

  // Mobile view - card layout
  const MobileView = () => (
    <div className="space-y-4 md:hidden">
      {phoneNumbers.map((number) => (
        <div
          key={number.id}
          className="bg-card p-4 rounded-lg border space-y-3"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium truncate">{number.display_phone_number}</p>
              <p className="text-sm text-muted-foreground truncate">{number.verified_name}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={number.code_verification_status === "VERIFIED" ? "secondary" : "outline"}>
                {number.code_verification_status || "PENDING"}
              </Badge>
              {!number.whatsapp_registered && (
                <Badge variant="destructive">Not Registered</Badge>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {!number.whatsapp_registered ? (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => openRegistration(number)}
              >
                Register Number
              </Button>
            ) : (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handleUseNumber(number)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Use Number
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  // Desktop view - table layout
  const DesktopView = () => (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Phone Number</TableHead>
            <TableHead>Verified Name</TableHead>
            <TableHead>Quality Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {phoneNumbers.map((number) => (
            <TableRow key={number.id}>
              <TableCell>{number.display_phone_number}</TableCell>
              <TableCell>{number.verified_name}</TableCell>
              <TableCell>
                <Badge className={cn(
                  number.quality_rating === "GREEN" && "bg-green-500",
                  number.quality_rating === "YELLOW" && "bg-yellow-500",
                  number.quality_rating === "RED" && "bg-red-500",
                  "bg-gray-500"
                )}>
                  {number.quality_rating}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Badge variant={number.code_verification_status === "VERIFIED" ? "secondary" : "outline"}>
                    {number.code_verification_status || "PENDING"}
                  </Badge>
                  {!number.whatsapp_registered && (
                    <Badge variant="destructive">Not Registered</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {!number.whatsapp_registered ? (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => openRegistration(number)}
                  >
                    Register Number
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleUseNumber(number)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Use Number
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  if (!phoneNumbers || phoneNumbers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 text-center">
        <p className="text-muted-foreground">No phone numbers found.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Add a phone number in your Meta Business account first.
        </p>
      </div>
    )
  }

  return (
    <>
      <MobileView />
      <DesktopView />

      <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Phone Number</DialogTitle>
            <DialogDescription>
              Enter your 6-digit WhatsApp verification PIN to register this number.
              {selectedNumber && (
                <p className="mt-2 font-medium">{selectedNumber.display_phone_number}</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Enter 6-digit PIN"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "")
                if (value.length <= 6) {
                  setPin(value)
                }
              }}
              type="text"
              maxLength={6}
              pattern="\d{6}"
            />
            <Button 
              className="w-full" 
              onClick={handleRegister}
              disabled={loading || pin.length !== 6}
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Number"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 