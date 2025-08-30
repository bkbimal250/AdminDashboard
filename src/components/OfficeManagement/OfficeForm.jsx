import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/Switch';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/Dialog';
import { Building2, X } from 'lucide-react';
import { officeAPI } from '@/services/api';
import { toast } from 'sonner';

const OfficeForm = ({ office, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postal_code: '',
    phone: '',
    email: '',
    website: '',
    office_code: '',
    is_active: true
  });
  const [loading, setLoading] = useState(false);

  const isEditing = !!office;

  useEffect(() => {
    if (office) {
      setFormData({
        name: office.name || '',
        address: office.address || '',
        city: office.city || '',
        state: office.state || '',
        country: office.country || 'India',
        postal_code: office.postal_code || '',
        phone: office.phone || '',
        email: office.email || '',
        website: office.website || '',
        office_code: office.office_code || '',
        is_active: office.is_active
      });
    } else {
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        postal_code: '',
        phone: '',
        email: '',
        website: '',
        office_code: '',
        is_active: true
      });
    }
  }, [office]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateOfficeCode = () => {
    if (formData.name) {
      const code = formData.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 3);
      handleInputChange('office_code', code);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.office_code || !formData.address || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing) {
        await officeAPI.updateOffice(office.id, formData);
        toast.success('Office updated successfully');
      } else {
        await officeAPI.createOffice(formData);
        toast.success('Office created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving office:', error);
      toast.error(isEditing ? 'Failed to update office' : 'Failed to create office');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <DialogTitle>
              {isEditing ? 'Edit Office' : 'Create New Office'}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Office Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter office name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="office_code">Office Code *</Label>
              <div className="flex space-x-2">
                <Input
                  id="office_code"
                  value={formData.office_code}
                  onChange={(e) => handleInputChange('office_code', e.target.value.toUpperCase())}
                  placeholder="e.g., DOS, BC, AMP"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateOfficeCode}
                  className="whitespace-nowrap"
                >
                  Auto
                </Button>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter complete address"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter city"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Enter state"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code *</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                placeholder="Enter postal code"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="Enter country"
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="Enter website URL"
            />
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Active Office</Label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{isEditing ? 'Update Office' : 'Create Office'}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OfficeForm;
